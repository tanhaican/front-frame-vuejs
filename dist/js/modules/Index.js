/**
 * Created by tanhaican on 2016/12/10.
 */
define(function(require,exports,module){var VueComponent=Vue.extend({ready:function(){var vm=this;vm.$router.replace({name:"orgGrouponList",params:{orgId:"10001"}})}});module.exports=VueComponent});