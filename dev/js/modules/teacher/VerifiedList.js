/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/teacher/verified_list.html"),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        getVerifidListURL = Constants.APP_SERVER_URL + 'order/search/findOrderCheckUserByPage',
        pageIndex = 1;// 当前页码

    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var VerifiedList = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                verifiedList: [],
                grouponId: null,
                count: 0
            }
        },
        ready: function () {
            var vm = this;

            GrouponService.getVerifidList(vm.grouponId, pageIndex, function(data) {
                Utils.concatArr(vm.verifiedList, data);
            });
        },
        route: {
            data: function(transition) {
                var vm = this;

                vm.grouponId = transition.to.params.grouponId;
                vm.count = transition.to.params.count;
            }
        }
    });

    var GrouponService = {
        getVerifidList: function (grouponId, pageIndex, callback) {
            var param = {
                groupId: grouponId,
                status: Constants.GROUPON_STATUS.PASSED,
                page: pageIndex || 1,
                rows: Constants.PAGE_INFO.PAGE_SIZE
            };
            var promise = Utils.post(getVerifidListURL, param);

            promise.then(function (response) {
                var retObj = response.body;

                if (retObj && retObj.code === 1) {
                    callback && callback(retObj.obj.rows);
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

    module.exports = VerifiedList;
});