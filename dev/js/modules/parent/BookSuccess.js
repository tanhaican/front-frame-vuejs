/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/parent/book_success.html"),
        Utils = require('js/common/Utils'),
        uuid;

    var BookSuccess = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                groupon: {}
            }
        },
        ready: function () {
            var vm = this,
                grouponInfo = Utils.Session.get('GROUPON_INFO');
            if(grouponInfo) {
                vm.groupon = grouponInfo;
            } else {
                // vm.$router.replace({name: 'orgGrouponList', params: {uuid: uuid}});
            }
        },
        route: {
            data: function(transition) {
                uuid = transition.to.params.uuid
            }
        },
        methods: {
            call: function(phone) {
                location.href = 'tel:' + phone;
            }
        }
    });

    module.exports = BookSuccess;
});