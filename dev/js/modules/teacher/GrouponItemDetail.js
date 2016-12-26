/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/teacher/groupon_item_detail.html"),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        getGrouponDetailURL = Constants.APP_SERVER_URL + 'group/groupDetail',
        shareItURL = Constants.APP_SERVER_URL + '/group/updateTransCount';

    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var GrouponDetail = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                ctrl: {
                    showBindPhoneBox: false,
                    showShareBtn: false,
                    openId: null,
                    uuid: null
                },
                groupon: {}
            }
        },
        ready: function () {
            var vm = this,
                ctrl = vm.ctrl;

            ctrl.openId = Utils.Session.get('OPEN_ID');

            GrouponService.getGrouponDetail(ctrl.uuid, function(data) {
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
            shareIt: function () {
                var vm = this,
                    ctrl = vm.ctrl;

                ctrl.showShareBtn = true;
            },
            shareToQzone: function() {
                var vm = this,
                    groupon = vm.groupon,
                    ctrl = vm.ctrl;

                wx.onMenuShareQZone({
                    title: buildShareTitle(groupon), // 分享标题
                    desc: '名师授课，欢迎报名参加', // 分享描述
                    link: getShareUrl(), // 分享链接
                    imgUrl: './images/logo.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        GrouponService.shareIt(ctrl.uuid);
                        ctrl.showShareBtn = false;
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        ctrl.showShareBtn = false;
                    }
                });
            },
            shareToQQ: function() {
                var vm = this,
                    groupon = vm.groupon,
                    ctrl = vm.ctrl;

                wx.onMenuShareQQ({
                    title: buildShareTitle(groupon), // 分享标题
                    desc: '名师授课，欢迎报名参加', // 分享描述
                    link: getShareUrl(), // 分享链接
                    imgUrl: './images/logo.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        GrouponService.shareIt(ctrl.uuid);
                        ctrl.showShareBtn = false;
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        ctrl.showShareBtn = false;
                    }
                });
            },
            shareToWeixin: function() {
                var vm = this,
                    groupon = vm.groupon,
                    ctrl = vm.ctrl;

                wx.onMenuShareAppMessage({
                    title: buildShareTitle(groupon), // 分享标题
                    desc: '名师授课，欢迎报名参加', // 分享描述
                    link: getShareUrl, // 分享链接
                    imgUrl: './images/logo.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        GrouponService.shareIt(ctrl.uuid);
                        ctrl.showShareBtn = false;
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        ctrl.showShareBtn = false;
                    }
                });
            },
            shareToTimeline: function () {
                var vm = this,
                    groupon = vm.groupon,
                    ctrl = vm.ctrl;

                wx.onMenuShareTimeline({
                    title: buildShareTitle(groupon), // 分享标题
                    link: getShareUrl(), // 分享链接
                    imgUrl: './images/logo.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        GrouponService.shareIt(ctrl.uuid);
                        ctrl.showShareBtn = false;
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        ctrl.showShareBtn = false;
                    }
                });
            }
        }
    });

    function buildShareTitle(groupon) {
        var title;
        if(!groupon) {
            return '';
        }

        title = '"' + groupon.goodName + '" 减价' + (groupon.actualMoney - groupon.groupMoney) + '，快来报名参与。';
        return title;
    }

    function getShareUrl() {
        var href = location.href;

        href = href.replace('/teacher/', '/parent/');
        return href;
    }

    var GrouponService = {
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
        shareIt : function(uuid, callback) {
            var promise = Utils.post(shareItURL, {uuid: uuid});

            promise.then(function(response) {
                var retObj = response.body;

                if(!retObj || retObj.code === 1) {// 分享成功
                    callback && callback(true);
                } else {
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
    };

    module.exports = GrouponDetail;
});