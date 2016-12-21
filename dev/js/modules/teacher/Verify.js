/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require('templates/modules/teacher/verify.html'),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        getMyVeifyGrouponsURL = Constants.APP_SERVER_URL + 'group/search/findGroupByPage',
        verifyByCodeURL = Constants.APP_SERVER_URL + 'order/validPass',
        pageIndex = 1;// 当前页码

    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var Verify = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                ctrl: {},
                openId: null,
                myVeifyGrouponList: []
            }
        },
        ready: function (data) {
            var vm = this;
            this.fetchData(pageIndex);
        },
        route: {
            data: function(transition) {
                var vm = this;

                vm.openId = transition.to.params.openId
            }
        },
        watch: {
            'grouponPwdList': function(val, oldVal) {
                this.generateQrcode(val);
            }
        },
        methods: {
            // 上拉加载更多数据
            fetchData: function (_pageIndex) {
                var vm = this;

                GrouponService.getMyVeifyGroupons(vm.openId, _pageIndex, function(data) {
                    Utils.concatArr(vm.myVeifyGrouponList, data && data.rows || []);
                });
            },
            verifyByCode: function() {
                var vm = this,
                    inputPwd = vm.ctrl.inputPwd;

                if(!inputPwd) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: '请输入预约密码后验证'
                    });
                    return;
                }
                GrouponService.verifyByCode(inputPwd, function() {
                    layer.open({
                        content: '验证成功'
                        ,btn: '我知道了'
                    });
                });
            },
            verifyByWx: function() {
                // 微信扫一扫
                wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        console.log(result);
                    }
                });

                wx.error(function (res) {
                    alert(res.errMsg);
                });
            },
            toVeirifiedList: function(grouponId, count) {
                var vm = this;

                vm.$router.go({name: 'teacherVerifiedList', params: {grouponId: grouponId, count: count}});
            }
        }
    });

    var GrouponService = {
        getMyVeifyGroupons: function (openId, pageIndex, callback) {
            var param = {
                teacherOpenid: openId,
                page: pageIndex || 1,
                rows: Constants.PAGE_INFO.PAGE_SIZE
            };
            var promise = Utils.post(getMyVeifyGrouponsURL, param);

            promise.then(function (response) {
                var retObj = response.body;

                if (retObj && retObj.code === 1) {
                    callback && callback(retObj.obj);
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                }
            }, function (response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        },
        verifyByCode: function (password, callback) {
            var param = {
                password: password
            };
            var promise = Utils.post(verifyByCodeURL, param);

            promise.then(function (response) {
                var retObj = response.body;

                if (retObj && retObj.code === 1) {
                    callback && callback(retObj.obj);
                } else {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                }
            }, function (response) {
                layer.open({
                    time: 1,
                    skin: 'msg',
                    content: '请求数据失败'
                });
            });
        }
    };


    module.exports = Verify;
});