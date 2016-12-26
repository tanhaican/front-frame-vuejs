define(function (require, exports, module) {
	var Utils = {};

	/**
	 * 手机号码:
	 * 13[0-9], 14[5,7], 15[0, 1, 2, 3, 5, 6, 7, 8, 9], 17[0, 1, 6, 7, 8], 18[0-9]
	 * 移动号段: 134,135,136,137,138,139,147,150,151,152,157,158,159,170,178,182,183,184,187,188
	 * 联通号段: 130,131,132,145,155,156,170,171,175,176,185,186
	 * 电信号段: 133,149,153,170,173,177,180,181,189
	 */
	Utils.isPhone = function (phone) {
		var phoneReg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;

		return phoneReg.test(phone);
	};

	Utils.getClientType = function() {
		var clientType = {
			isAndroid: false,
			isIOS: false,
			isMicroMessager: false,
			isPC: false
		};
		var navAgent = navigator.userAgent
			, isAndroid = /android/ig.test(navAgent)
			, isIOS = /iphone|ipod|ipad/ig.test(navAgent)
			, isWeixin = /MicroMessenger/ig.test(navAgent);
		if (isIOS) {
			clientType.isAndroid = false;
			clientType.isIOS = true
		} else {
			if (isAndroid) {
				clientType.isAndroid = true;
				clientType.isIOS = false
			}
		}
		clientType.isMicroMessager = isWeixin;
		clientType.isPC = !(isAndroid || isIOS || isWeixin);
		return clientType;
	};

	/**
	 * 使用POST方式请求数据（注意，content type：application/x-www-form-urlencoded）
	 * @param url
	 * @param param
	 */
	Utils.post = function(url, param) {
		return Vue.http.post(url, param, {emulateJSON: true});
	};

	/**
	 * 给数组arr后面附加数组concatArr
	 * @param arr
	 * @param concatArr
	 */
	Utils.concatArr = function(arr, concatArr) {
		Array.isArray(arr) && Array.isArray(concatArr) && arr.push.apply(arr, concatArr);
	};

	Utils.isJsonStr = function(str) {
		var regxObj = /^{.*}$/,
			regxArr = /^\[.*\]$/,
			isJsonStr = false;
		if('string' === typeof str) {
			if(regxObj.test(str) || regxArr.test(str)) {
				try {
					JSON.parse(str);
					isJsonStr = true;
				} catch(e) {
				}
			}
		}
		return isJsonStr;
	};

	/**
	 * 判断是否 ISO date strings
	 * @param str
	 * @returns {boolean|*}
	 */
	Utils.isDateJsonStr = function(str) {
		var dateRegx = /^\"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z\"$/;
		return 'string' === typeof str && dateRegx.test(str);
	};

	/**
	 * 解析ISO date strings并返回对应的Date值
	 * @param str
	 * @returns {Date}
	 */
	Utils.getDate = function(str) {
		var dateRegx = /^\"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z\"$/,
			a;
		if (typeof str === 'string') {
			a = dateRegx.exec(str);
			if (a) {
				return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
					+a[5], +a[6]));
			}
		}
	};

	Utils.Session = sessionStorage && {
		put: function(key, value) {
			if(arguments.length < 2) {
				throw '请输入两个参数';
			}
			if(!key) {
				throw 'key 不能为空';
			}
			if('function' === typeof value) {
				throw '无法保存function';
			}
			if('object' === typeof value) {
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);
		},
		get: function(key) {
			var value = sessionStorage.getItem(key);
			if(value) {
				if(Utils.isDateJsonStr(value)) {
					value = Utils.getDate(value);
				} else if(Utils.isJsonStr(value)) {
					value = JSON.parse(value);
				}
			}
			return value;
		},
		delete: function(key) {
			sessionStorage.removeItem(key);
		},
		clear: function() {
			for(var i = 0, len = sessionStorage.length; i < len; i++){
				var key = sessionStorage.key(i);

				sessionStorage.removeItem(key);
			}
		}
	} || {
		put: function(key, value) {
			if(arguments.length < 2) {
				throw '请输入两个参数';
			}
			if(!key) {
				throw 'key 不能为空';
			}
			if('function' === typeof value) {
				throw '无法保存function';
			}
			var data = window._session_data_ = (window._session_data_ || {}) ;

			if('object' === typeof value) {
				value = JSON.stringify(value);
			}
			data || (data = {});
			data[key] = value;
		},
		get: function(key) {
			var data = window._session_data_,
				value = data && data[key];

			if(value) {
				if(Utils.isDateJsonStr(value)) {
					value = Utils.getDate(value);
				} else if(Utils.isJsonStr(value)) {
					value = JSON.parse(value);
				}
			}
			return value;
		},
		delete: function(key) {
			var data = window._session_data_;

			data[key] = null;
			delete data[key];
		},
		clear: function() {
			window._session_data_ = null;
		}
	};


	module.exports = Utils;
});