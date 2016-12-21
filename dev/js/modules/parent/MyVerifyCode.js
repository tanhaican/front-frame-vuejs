/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/parent/my_verify_code.html"),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        getMyGrouponPwdListURL = Constants.APP_SERVER_URL + 'order/search/findGroupOrderPwdByPage',
        openId,
        pageIndex = 1;// 当前页码

    require('js/lib/qrcode.min'),
    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var MyVerifyCode = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                grouponPwdList: []
            }
        },
        ready: function (data) {
            var vm = this;
            this.fetchData(pageIndex);
        },
        route: {
            data: function(transition) {
                openId = transition.to.params.openId
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

                GrouponService.getMyGrouponPwdList(openId, _pageIndex, function(data) {
                    Utils.concatArr(vm.grouponPwdList, data && data.rows || []);
                });
            },
            generateQrcode: function(grouponPwdList) {
                if(!grouponPwdList || !grouponPwdList.length) {
                    return;
                }
                for(var i = 0, length = grouponPwdList.length; i < length; i++) {
                    var grouponPwd = grouponPwdList[i];

                    new QRCode('qrcode' + grouponPwd.groupId, grouponPwd.password);// 设置二维码
                }
            }
        }
    });

    var GrouponService = {
        getMyGrouponPwdList: function (openId, pageIndex, callback) {
            var param = {
                openid: openId,
                page: pageIndex || 1,
                rows: Constants.PAGE_INFO.PAGE_SIZE
            };
            var promise = Utils.post(getMyGrouponPwdListURL, param);

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


    module.exports = MyVerifyCode;
});