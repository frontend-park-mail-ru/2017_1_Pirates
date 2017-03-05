'use strict';


window.Framework.BackendTag = class extends HTMLElement {
	constructor() {
		super();
		this.__swagger__ = null;
	}

	get host() {
		const url = this.getAttribute('url');

		if (url == '*') {
			return document.location.origin;
		}

		return url;
	}

	get swagger() {
		return this.__swagger__;
	}

	get swaggerUrl() {
		return `${this.getAttribute('swagger') || 'swagger.json'}`;
	}

	connectedCallback() {
		const xhr = new XMLHttpRequest();
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

	__checkArgs__(pathInfo, args) {

	}

	__createHandler__(current, handlerName, path, method) {
		current[handlerName] = (args, callback) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method.toUpperCase(), `${this.host}${path}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE && callback) {
					callback(xhr.status, JSON.parse(xhr.responseText));
				}
			};

			xhr.send(JSON.stringify(args));
		};

		const pathInfo = this.swagger.paths[path][method];
		const alias = (pathInfo.description.match(/`([^)]+)`/)[1] || '').replace(' ', '').split(':')[1];

		if (alias) {
			window.Network[alias] = current[handlerName];
		}
	}

	__parseSwagger__() {
		Object.keys(this.swagger.paths).forEach((path) => {
			let current = window.Network;

			path.split('/').forEach((part, index, parts) => {
				if (part.length == 0) return;

				if (index != parts.length - 1) {
					if (!current[part]) {
						current[part] = {};
					}

					current = current[part];
					return;
				}

				Object.keys(this.swagger.paths[path]).forEach((method) => {
					const handlerName = `${method}${part.slice(0, 1).toUpperCase()}${part.slice(1)}`;
					this.__createHandler__(current, handlerName, path, method);
				});
			});
		});

		console.dir(window.Network);
	}
};
