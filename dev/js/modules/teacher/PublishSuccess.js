/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/teacher/publish_success.html"),
        Constants = require('js/common/Constants');

    var Publish = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                grouponId: null
            }
        },
        ready: function () {
            //this.fetchData();
        },
        route: {
            data: function(transition) {
                var vm = this;

                vm.grouponId = transition.to.params.grouponId;
            }
        },
        methods: {
            toDetail: function () {
                var vm = this;

                vm.$router.replace({name: 'teacherGrouponItemDetail', params: {uuid: vm.grouponId}});
            }
        }
    });

    module.exports = Publish;
});