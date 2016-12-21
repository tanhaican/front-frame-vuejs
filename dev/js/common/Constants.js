define(function (require, exports, module) {
	var Constants = {};

	// Constants.APP_SERVER_URL = 'http://172.1.3.225:8080/onlive/';//TODO 开发测试用
	Constants.APP_SERVER_URL = 'http://edu.idaycrm.com/onlive/';

	Constants.PAGE_INFO = {
		PAGE_SIZE: 10// 每页记录条数
	};

	Constants.GROUPON_STATUS = {// 团购状态
		AUDDITING: '1',// 审核中
		PASSED: '2',// 审核通过
		REJECTED: '',// 审核未通过
		CLOSED: '3' // 已下架
	};

	Constants.MSG_COUNT_DOWN = 120;

	module.exports = Constants;
});