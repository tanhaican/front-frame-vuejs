/**
 * Created by tanhaican on 2016/12/10.
 */
define(function(require,exports,module){function buildShareTitle(groupon){var title;return groupon?title='"'+groupon.goodName+'" 减价'+(groupon.actualMoney-groupon.groupMoney)+"，快来报名参与。":""}function getShareUrl(){var href=location.href;return href=href.replace("/teacher/","/parent/")}var sTpl=require("templates/modules/teacher/groupon_item_detail.html"),Constants=require("js/common/Constants"),Utils=require("js/common/Utils"),getGrouponDetailURL=Constants.APP_SERVER_URL+"group/groupDetail",shareItURL=Constants.APP_SERVER_URL+"/group/updateTransCount";require("js/lib/layer_mobile/layer.js"),require("js/lib/layer_mobile/need/layer.css");var GrouponDetail=Vue.extend({template:sTpl,data:function(){return{ctrl:{showBindPhoneBox:!1,showShareBtn:!1,openId:null,uuid:null},groupon:{}}},ready:function(){var vm=this,ctrl=vm.ctrl;ctrl.openId=Utils.Session.get("OPEN_ID"),GrouponService.getGrouponDetail(ctrl.uuid,function(data){vm.groupon=data.obj})},route:{data:function(transition){var vm=this;vm.ctrl.uuid=transition.to.params.uuid}},methods:{call:function(phone){location.href="tel:"+phone},viewMap:function(){var vm=this,groupon=vm.groupon;vm.$router.go({name:"viewOrgLocationMap",params:{lng:groupon.longitude,lat:groupon.latitude,orgName:groupon.orgName}})},shareIt:function(){var vm=this,ctrl=vm.ctrl;ctrl.showShareBtn=!0},shareToQzone:function(){var vm=this,groupon=vm.groupon,ctrl=vm.ctrl;wx.onMenuShareQZone({title:buildShareTitle(groupon),desc:"名师授课，欢迎报名参加",link:getShareUrl(),imgUrl:"./images/logo.png",success:function(){GrouponService.shareIt(ctrl.uuid),ctrl.showShareBtn=!1},cancel:function(){ctrl.showShareBtn=!1}})},shareToQQ:function(){var vm=this,groupon=vm.groupon,ctrl=vm.ctrl;wx.onMenuShareQQ({title:buildShareTitle(groupon),desc:"名师授课，欢迎报名参加",link:getShareUrl(),imgUrl:"./images/logo.png",success:function(){GrouponService.shareIt(ctrl.uuid),ctrl.showShareBtn=!1},cancel:function(){ctrl.showShareBtn=!1}})},shareToWeixin:function(){var vm=this,groupon=vm.groupon,ctrl=vm.ctrl;wx.onMenuShareAppMessage({title:buildShareTitle(groupon),desc:"名师授课，欢迎报名参加",link:getShareUrl,imgUrl:"./images/logo.png",success:function(){GrouponService.shareIt(ctrl.uuid),ctrl.showShareBtn=!1},cancel:function(){ctrl.showShareBtn=!1}})},shareToTimeline:function(){var vm=this,groupon=vm.groupon,ctrl=vm.ctrl;wx.onMenuShareTimeline({title:buildShareTitle(groupon),link:getShareUrl(),imgUrl:"./images/logo.png",success:function(){GrouponService.shareIt(ctrl.uuid),ctrl.showShareBtn=!1},cancel:function(){ctrl.showShareBtn=!1}})}}}),GrouponService={getGrouponDetail:function(uuid,callback){var promise=Utils.post(getGrouponDetailURL,{uuid:uuid});promise.then(function(response){var retObj=response.body;retObj&&1===retObj.code?callback&&callback(retObj):layer.open({time:1,skin:"msg",content:retObj.msg})},function(response){layer.open({time:1,skin:"msg",content:"请求数据失败"})})},shareIt:function(uuid,callback){var promise=Utils.post(shareItURL,{uuid:uuid});promise.then(function(response){var retObj=response.body;retObj&&1!==retObj.code?callback&&callback(!1):callback&&callback(!0)},function(response){layer.open({time:1,skin:"msg",content:"请求数据失败"})})}};module.exports=GrouponDetail});