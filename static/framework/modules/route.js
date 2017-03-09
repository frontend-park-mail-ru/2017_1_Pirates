'use strict';


window.Framework.Route = class Route extends HTMLElement {
	constructor() {
		super();
	}

	get id() {
		return this.getAttribute('id');
	}

	get path() {
		return this.getAttribute('path');
	}

	complies(hash) {
		const argExp = /<(\w|\d|=)+>/;

		let declared = this.path.slice(1).split('__');
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
		} catch (error) {
			return null;
		}

		return args;
	}

	fire(args) {
		Route.showActivity(this.activity, this.methodName, args || {});
	}

	navigate(args) {
		args = args || {};
		const argExp = /<(\w|\d|=)+>/;
		const declared = this.path.slice(1).split('__');
		let final = [];

		declared.forEach((part) => {
			if (final.length !== 0) final.push('__');

			if (argExp.test(part)) {
				const arg = part.slice(1, -1).split('=');
				final.push(args[arg[0]] || arg[1] || '');
				return;
			}

			final.push(part);
		});

		window.location.hash = '#' + final.join('');
	}

	static showActivity(activity, methodName, args) {
		methodName = methodName || 'onEnter';
		args = args || {};
		const content = document.querySelector('app-content');

		if (typeof activity === 'string') {
			activity = window.Framework.activities[activity];
		}

		content.addEventListener('AnimationEnd', () => {
			window.Framework.currentActivity = activity;
			activity.onBeforeEnter();
			activity[methodName](args);
		}, {once: true});

		if (window.Framework.currentActivity) {
			window.Framework.currentActivity.onBeforeLeave();
			window.Framework.currentActivity.onLeave();
		} else {
			content.dispatchEvent(new Event('AnimationEnd'));
		}
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
