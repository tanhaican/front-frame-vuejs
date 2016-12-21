/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/parent/groupon_item_detail.html"),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        checkBindStateURL = Constants.APP_SERVER_URL + 'order/isBindPhone',
        sendVariCodeURL = Constants.APP_SERVER_URL + 'order/sendPhone',
        bindPhoneURL = Constants.APP_SERVER_URL + 'order/bindPhone',
        getGrouponDetailURL = Constants.APP_SERVER_URL + 'group/groupDetail',
        bookGrouponURL = Constants.APP_SERVER_URL + 'order/addGorder';

    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var GrouponDetail = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                ctrl: {
                    showBindPhoneBox: false,
                    uuid: null,
                    countDown: null
                },
                openId: null,
                groupon: {}
            }
        },
        ready: function () {
            var vm = this;

            vm.openId = Utils.Session.get('OPEN_ID');

            GrouponService.getGrouponDetail(vm.ctrl.uuid, function(data) {
                vm.groupon = data.obj;
            });
        },
        route: {
            data: function(transition) {
                var vm = this;

                vm.ctrl.uuid = transition.to.params.uuid
            }
        },
        methods: {
            call: function(phone) {
                location.href = 'tel:' + phone;
            },
            viewMap: function() {
                var vm = this,
                    groupon = vm.groupon;

                vm.$router.go({name: 'viewOrgLocationMap', params: {lng: groupon.longitude, lat: groupon.latitude, orgName: groupon.orgName}});
            },
            bookGroupon: function() {
                var vm = this;

                // 1. 检测用户是否绑定手机，没有则弹框提示绑定
                // 2. 绑定成功后发起预约
                GrouponService.checkBindState(vm.openId, function(isBinded) {
                    if(!isBinded) {
                        vm.ctrl.showBindPhoneBox = true;
                    } else {
                        var uuid = vm.ctrl.uuid;
                        // 发起预约
                        GrouponService.bookGroupon(uuid, vm.openId, function(data) {
                            Utils.Session.put('GROUPON_INFO', data);
                            vm.$router.replace({name: 'parentBookSuccess', params: {uuid: uuid}});
                        });
                    }

                });
            },
            sendValidCode: function () {
                var vm = this,
                    ctrl = vm.ctrl,
                    phoneNo = ctrl.mobilephone;

                ctrl.validCode = '';
                if(ctrl.countDown && ctrl.countDown > 0) {

                }
                if(!phoneNo) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入手机号'
                    });
                } else if(Utils.isPhone(phoneNo)) {
                    GrouponService.sendVariCode(phoneNo, vm.openId, function() {
                        ctrl.countDown = Constants.MSG_COUNT_DOWN;
                        var interval = setInterval(function() {
                            ctrl.countDown -= 1;
                            if(0 >= ctrl.countDown) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    });
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入正确的手机号'
                    });
                }
            },
            bindPhone: function () {
                var vm = this,
                    phoneNo = vm.ctrl.mobilephone,
                    variCode = vm.ctrl.validCode,
                    binder = {
                        openid: vm.openId,
                        mobilephone: phoneNo,
                        validCode: variCode
                    };

                if(!phoneNo) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入手机号'
                    });
                    return;
                }
                if(!variCode) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入验证码'
                    });
                }
                GrouponService.bindPhone(binder, function(isBindSuccess) {
                    if(isBindSuccess) {
                        var uuid = vm.ctrl.uuid;

                        vm.ctrl.showBindPhoneBox = false;
                        // 发起预约
                        GrouponService.bookGroupon(uuid, vm.openId, function(data) {
                            Utils.Session.put('GROUPON_INFO', data);
                            vm.$router.replace({name: 'parentBookSuccess', params: {uuid: uuid}});
                        });
                    }
                });
            }
        }
    });

    var GrouponService = {
        checkBindState : function(openId, callback) {
            var promise = Utils.post(checkBindStateURL, {openid: openId});

            promise.then(function(response) {
                var retObj = response.body;

                if(!retObj || retObj.code === 0) {// 未绑定手机
                    callback && callback(false);
                } else {
                    callback && callback(true);
                }
            }, function(response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        },
        sendVariCode: function(phoneNo, openId, callback) {
            var promise = Utils.post(sendVariCodeURL, {mobilephone: phoneNo});

            promise.then(function(response) {
                var retObj = response.body;

                if(retObj && retObj.code === 1) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '短信已发送'
                    });
                    callback();
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '短信发送失败'
                    });
                }
            }, function(response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        },
        bindPhone: function(binder, callback) {
            if(binder) {
                if(!binder.openid) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '获取信息失败，请重新进入'
                    });
                    return;
                }
                if(!binder.mobilephone) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '手机号码不能为空'
                    });
                    return;
                }
                if(!binder.validCode) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入验证码'
                    });
                    return;
                }
                var promise = Utils.post(sendVariCodeURL, binder);

                promise.then(function(response) {
                    var retObj = response.body;

                    if(retObj && retObj.code === 1) {
                        layer.open({
                            time: 1,
                            skin: 'msg',
                            content: '绑定成功'
                        });

                        callback && callback(true);
                        layer.closeAll()
                    } else {
                        layer.open({
                            time: 1,
                            skin: 'msg',
                            content: '绑定失败'
                        });
                        callback && callback(false);
                    }
                }, function(response) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请求数据失败'
                    });
                });
            }
        },
        getGrouponDetail : function(uuid, callback) {
            var promise = Utils.post(getGrouponDetailURL, {uuid: uuid});

            promise.then(function(response) {
                var retObj = response.body;

                if(retObj && retObj.code === 1) {
                    callback && callback(retObj);
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                }
            }, function(response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        },
        bookGroupon: function(grouponId, openId, successCallback) {
            var promise = Utils.post(bookGrouponURL, {groupId: grouponId, openid: openId});

            promise.then(function(response) {
                var retObj = response.body;

                if(retObj && retObj.code === 1) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '恭喜您，预约成功'
                    });
                    successCallback && successCallback(retObj.obj);
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                }
            }, function(response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        }
    };

    module.exports = GrouponDetail;
});