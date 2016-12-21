define(function(require, exports) {
	var App = Vue.extend({}),// 路由器需要一个根组件。
		router = new VueRouter(),// 创建一个路由器实例
		Constants = require('js/common/Constants'),
		Utils = require('js/common/Utils'),
		getUserOpenIdURL = Constants.APP_SERVER_URL + 'weixin/getOpenid',
		getWxAppIdURL = Constants.APP_SERVER_URL + 'weixin/getAppInfo';

	require("js/lib/layer_mobile/layer.js");
	require("js/lib/layer_mobile/need/layer.css");

	var clientType = Utils.getClientType();
	if(clientType.isPC) {
		return location.replace(Constants.APP_SERVER_URL);
	}

	// 定义路由规则
	router.map({
		'/': {
			component: function (resolve) {
				require.async(['js/modules/Index.js'], resolve);
			}
		},
		'/teacher/:teacherOpenid/publish': {
			name: "teacherPublish",
			component: function (resolve) {
				require.async(['js/modules/teacher/Publish.js'], resolve);
			}
		},
		'/teacher/:grouponId/publishSuccess': {
			name: "teacherPublishSuccess",
			component: function (resolve) {
				require.async(['js/modules/teacher/PublishSuccess.js'], resolve);
			}
		},
		'/teacher/:openId/grouponList': {
			name: "teacherGrouponList",
				component: function (resolve) {
				require.async(['js/modules/teacher/GrouponList.js'], resolve);
			}
		},
		'/teacher/:uuid/grouponItemDetail': {
			name: "teacherGrouponItemDetail",
				component: function (resolve) {
				require.async(['js/modules/teacher/GrouponItemDetail.js'], resolve);
			}
		},
		'/teacher/:openId/verify': {
			name: "teacherVerify",
			component: function (resolve) {
				require.async(['js/modules/teacher/Verify.js'], resolve);
			}
		},
		'/teacher/:grouponId/verifiedList/:count': {
			name: "teacherVerifiedList",
			component: function (resolve) {
				require.async(['js/modules/teacher/VerifiedList.js'], resolve);
			}
		},
		'/parent/:orgId/grouponList': {
			name: "orgGrouponList",
			component: function (resolve) {
				require.async(['js/modules/parent/GrouponList.js'], resolve);
			}
		},
		'/parent/:uuid/grouponItemDetail': {
			name: "orgGrouponItemDetail",
			component: function (resolve) {
				require.async(['js/modules/parent/GrouponItemDetail.js'], resolve);
			}
		},
		'/parent/:uuid/bookSuccess': {
			name: "parentBookSuccess",
			component: function (resolve) {
				require.async(['js/modules/parent/BookSuccess.js'], resolve);
			}
		},
		'/parent/:openId/myVerifyCode': {
			name: "parentMyVerifyCode",
			component: function (resolve) {
				require.async(['js/modules/parent/MyVerifyCode.js'], resolve);
			}
		},
		'/map/orgLocation/:lng/:lat/:orgName': {
			name: "viewOrgLocationMap",
			component: function (resolve) {
				require.async(['js/modules/map/OrgLocation.js'], resolve);
			}
		}
	});

	getUserOpenId(function(openId) {
		Utils.Session.put('OPEN_ID', openId);
		initWx();
		// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
		router.start(App, 'html');
	});

	router.afterEach(function (transition) {
		console.log('成功浏览到: ' + transition.to.path);
	});

	function getUserOpenId(callback) {
		var promise = Utils.post(getUserOpenIdURL);

		promise.then(function (response) {
			var retObj = response.body;

			if (retObj && retObj.code === 1) {
				retObj.obj = 'ceshi001';//TODO 获取用户openId
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

	function initWx() {
		var promise = Utils.post(getWxAppIdURL);

		promise.then(function (response) {
			var retObj = response.body;

			if (retObj && retObj.code === 1) {
				var appInfo = retObj.obj;

				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appInfo.appid, // 必填，公众号的唯一标识
					timestamp: appInfo.timestamp, // 必填，生成签名的时间戳
					nonceStr: appInfo.noncestr, // 必填，生成签名的随机串
					signature: appInfo.sign,// 必填，签名，见附录1
					jsApiList: ['onMenuShareQZone', 'onMenuShareQQ', 'onMenuShareTimeline',
						'onMenuShareAppMessage', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
});