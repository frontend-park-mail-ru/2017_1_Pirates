'use strict';


class Activity extends HTMLElement {
	constructor() {
		super();
		this.__view = null;
	}

	get view() {
		return this.__view;
	}

	set view(view) {
		this.__view = view;
	}
}


class View extends HTMLElement {
	constructor() {
		super();
	}
}


class Route extends HTMLElement {
	constructor() {
		super();
	}

	complies(hash) {
		const argExp = /<(\w|\d|=)+>/;

		let declared = this.getAttribute('path').split('__');
		let requested = hash.split('__');
		let args = {};

		try {
			for (let i = 0; i < declared.length; i++) {
				if (argExp.test(declared[i])) {
					let arg = declared[i].slice(1, -1).split('=');
					args[arg[0]] = requested.slice(1, -1) || arg[1];
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
		return document.querySelector(`app-activity#${this.activityId}`);
	}
}


const loadViews = () => {
	let views = {};

	[...document.querySelectorAll('link[rel=import]')].forEach((link) => {
		let view = link.import.querySelector('app-view');
		views[view.id] = view;
	});

	return views;
};


const loadRouting = () => {
	return [...document.querySelectorAll('app-routing app-route')];
};


const ready = () => {
	customElements.define('app-view', View);
	customElements.define('app-activity', Activity);
	customElements.define('app-route', Route);

	window.Framework = {};
	window.Framework.views = loadViews();
	window.Framework.routing = loadRouting();
	window.Framework.activities = [...document.querySelectorAll('app-inf app-activities app-activity')];

	window.Framework.activities.forEach((activity) => {
		activity.view = window.Framework.views[activity.getAttribute('view')];
	});
};


const hashChange = () => {
	window.Framework.routing.some((route) => {
		let args = route.complies(document.location.hash);

		if (args) {
			route.fire(args);
			return true;
		}
	});
};


window.addEventListener("hashchange", hashChange);
window.addEventListener("load", ready);
