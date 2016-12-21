/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/teacher/publish.html"),
        Constants = require('js/common/Constants'),
        Utils = require('js/common/Utils'),
        publishURL = Constants.APP_SERVER_URL + 'group/addGroup',
        getUserInfoByIdURL = Constants.APP_SERVER_URL + 'group/getUserInfoById',
        teacherOpenid ;

    require("js/lib/layer_mobile/layer.js");
    require("js/lib/layer_mobile/need/layer.css");

    var Publish = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                groupon: {},
                userInfo: {}
            }
        },
        ready: function () {
            this.fetchData();
        },
        route: {
            data: function(transition) {
                teacherOpenid = transition.to.params.teacherOpenid
            }
        },
        methods: {
            fetchData: function() {
                var vm = this;

                vm.userInfo = {nickname: '理才网-王老师'};
                //TODO 对接获取用户信息接口
                /*GrouponService.getUserInfoById(teacherOpenid, function(userInfo) {
                    vm.userInfo = userInfo;
                });*/
            },
            publishGroupon: function () {
                var vm = this,
                    postData = _.clone(vm.groupon);

                postData.teacherOpenid = teacherOpenid;

                GrouponService.publishGroupon(postData, function(data) {
                    vm.$router.replace({name: 'teacherPublishSuccess', params: {grouponId: data || ''}});
                });
            }
        }
    });

    var GrouponService = {
        getUserInfoById: function(openId, callback) {
            var promise = Utils.post(getUserInfoByIdURL, groupon);

            promise.then(function (response) {
                var retObj = response.body;

                if(retObj && retObj.code === 1) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                    callback && callback(retObj.obj);
                } else {
                    layer.open({
                        skin: 'msg',
                        time: 1,
                        content: '发布失败'
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
        publishGroupon: function (groupon, callback) {
            var promise = Utils.post(publishURL, groupon);

            promise.then(function (response) {
                var retObj = response.body;

                if(retObj && retObj.code === 1) {
                    layer.open({
                        time: 1,
                        skin: 'msg',
                        content: retObj.msg
                    });
                    callback && callback(retObj.obj);
                } else {
                    layer.open({
                        skin: 'msg',
                        time: 1,
                        content: '发布失败'
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

    module.exports = Publish;
});