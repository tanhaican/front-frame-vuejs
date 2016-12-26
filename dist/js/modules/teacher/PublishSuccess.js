/**
 * Created by tanhaican on 2016/12/10.
 */
define(function(require,exports,module){var sTpl=require("templates/modules/teacher/publish_success.html"),Publish=(require("js/common/Constants"),Vue.extend({template:sTpl,data:function(){return{grouponId:null}},ready:function(){},route:{data:function(transition){var vm=this;vm.grouponId=transition.to.params.grouponId}},methods:{toDetail:function(){var vm=this;vm.$router.replace({name:"teacherGrouponItemDetail",params:{uuid:vm.grouponId}})}}}));module.exports=Publish});