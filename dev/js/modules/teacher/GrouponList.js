/**
 * Created by tanhaican on 2016/12/10.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/teacher/groupon_list.html"),
        Constants = require('js/common/Constants'),
		Utils = require('js/common/Utils'),
        getGrouponListURL = Constants.APP_SERVER_URL + 'group/search/findGroupByPage',
		pageIndex = 1;

	require("js/lib/layer_mobile/layer.js");
	require("js/lib/layer_mobile/need/layer.css");

    var GrouponList = Vue.extend({
        template: sTpl,
	    data: function() {
	    	return {
	    		grouponList: [],
				openId: null
	    	}
		},
		ready: function () {
		    this.fetchData();
		},
		route: {
			data: function(transition) {
				var vm = this;

				vm.openId = transition.to.params.openId
			}
		},
		methods: {
		    fetchData: function () {
				var vm = this;

				GrouponService.getGrouponList(vm.openId, pageIndex, function(data) {
					Utils.concatArr(vm.grouponList, data);
				});
		    },
			toGrouponDetail: function(uuid) {
				var vm = this;

				vm.$router.go({name: 'teacherGrouponItemDetail', params: {uuid: uuid}});
			}
		  }
    });

	var GrouponService = {
		getGrouponList: function (teacherOpenid, pageIndex, callback) {
			var param = {
				teacherOpenid: teacherOpenid,
				page: pageIndex || 1,
				rows: Constants.PAGE_INFO.PAGE_SIZE
			};
			var promise = Utils.post(getGrouponListURL, param);

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


    module.exports = GrouponList;
});