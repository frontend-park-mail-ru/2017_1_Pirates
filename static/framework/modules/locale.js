'use strict';


/*
	Для будущего использования
 */


window.Framework.LocaleTag = class Locale extends HTMLElement {

	constructor() {
		super();
		this.__locale__ = null;
	}


	get url() {
		return this.getAttribute('url');
	}


	get locale() {
		return this.__locale__;
	}


	__parseLocale__() {
		const dict = {};

		const iterate = (node, path) => {
			Object.keys(node).forEach((key) => {
				if (typeof node[key] === 'object') {
					iterate(node[key], `${path}.${key}`);
					return;
				}

				dict[`${path}.${key}`] = toString(node[key] || '');
			});
		};

		window.t = (key) => {
			const value = dict[key];

			if (!value) {
				throw new Error(`No locale found for this key: ${key}`);
			}

			return value;
		};
	}


	connectedCallback() {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', this.url, true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
				this.__locale__= JSON.parse(xhr.responseText);
				this.__parseLocale__();

				window.dispatchEvent(new Event('LocaleLoad'));
			}
		};

		xhr.send();
	}

};
