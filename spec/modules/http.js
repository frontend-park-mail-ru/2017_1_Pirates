import 'whatwg-fetch'

(function () {
	'use strict';

	class HTTP {
		constructor() {
			if (HTTP.__instance) {
				return HTTP.__instance;
			}

			this._headers = {};
			this._baseUrl = '';

			HTTP.__instance = this;
		}

		get Headers() {
			return this._headers;
		}

		set Headers(value) {
			if (!(value && ('' + value === '[object Object]'))) {
				throw new TypeError('Headers must be a plain object');
			}

			const valid = Object.keys(value).every(key => typeof value[key] === 'string');
			if (!valid) {
				throw new TypeError('Headers must be a plain object');
			}
			this._headers = value;
		}

		get BaseURL() {
			return this._baseUrl;
		}

	}

})()











