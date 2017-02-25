'use strict';


window.Framework.Route = class Route extends HTMLElement {
	constructor() {
		super();
	}

	complies(hash) {
		const argExp = /<(\w|\d|=)+>/;

		let declared = this.getAttribute('path').slice(1).split('__');
		let requested = hash.slice(1).split('__');
		let args = {};

		try {
			for (let i = 0; i < declared.length; i++) {
				if (argExp.test(declared[i])) {
					let arg = declared[i].slice(1, -1).split('=');
					args[arg[0]] = requested[i] || arg[1];
				} else if (declared[i].toLowerCase() !== requested[i].toLowerCase()) {
					return null;
				}
			}
		} catch (TypeError) {
			return null;
		}

		return args;
	}

	fire(args) {
		this.activity.onBeforeEnter();
		this.activity[this.methodName](args);
	}


	get route() {
		return this.getAttribute('activity');
	}

	get activityId() {
		let route = this.route.split('#');
		return route[0];
	}

	get methodName() {
		let route = this.route.split('#');
		return route[1] || 'onEnter';
	}

	get activity() {
		return window.Framework.activities[this.activityId];
	}
};
