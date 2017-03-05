'use strict';


window.Framework.BackendTag = class extends HTMLElement {
	constructor() {
		super();
		this.__url__ = null;
		this.__swagger__ = null;
	}

	get url() {
		return this.__url__;
	}

	set url(url) {
		this.__url__ = url;
	}

	get swagger() {
		return this.__swagger__;
	}

	connectedCallback() {
		this.url = this.getAttribute('url');

		const xhr = new XMLHttpRequest();
		xhr.open('GET', this.url, true);

		xhr.onreadystatechange = () => {
			if (xhr.status == 200) {
				//alert(xhr.responseText);
				//this.__swagger__= JSON.parse(xhr.responseText);
				//this.__parseSwagger__();
			} else {
				this.__swagger__ = null;
			}

			window.dispatchEvent(new Event('SwaggerSpecLoad'));
		};

		xhr.send();
	}

	__parseSwagger__() {
		//Object.keys(this.swagger.paths).forEach((path) => {
		//	const parts = path.split('/');
		//});
	}
};
