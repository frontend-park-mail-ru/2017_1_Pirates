'use strict';


window.Framework.BackendTag = class extends HTMLElement {
	constructor() {
		super();
		this.__swagger__ = null;
	}

	get host() {
		return this.getAttribute('url');
	}
	get swagger() {
		return this.__swagger__;
	}

	get swaggerUrl() {
		return `${this.host}/${this.getAttribute('swagger') || 'swagger.json'}`;
	}

	connectedCallback() {
		const xhr = new XMLHttpRequest();
		let loaded = false;

		xhr.open('GET', this.swaggerUrl, true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
				this.__swagger__= JSON.parse(xhr.responseText);
				this.__parseSwagger__();

				window.dispatchEvent(new Event('SwaggerSpecLoad'));
			}

			this.__swagger__ = null;
		};

		xhr.send();
	}

	__parseSwagger__() {
		Object.keys(this.swagger.paths).forEach((path) => {
			const parts = path.split('/');
		});
	}
};
