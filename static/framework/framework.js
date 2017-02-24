'use strict';


class ActivityData extends HTMLElement {
	constructor() {
		super();
	}
}


class Activity {
	constructor() {
		this.view = null;
	}

	onEnter(args) {
	}

	onLeave(args) {
	}

	onSetupListeners() {
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
		return window.Framework.activities.hash[this.activityId];
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
	return [...document.querySelectorAll('app-routing app-route')].sort((a, b) => {
		return a.length - b.length;
	});
};


const loadActivities = () => {
	let activities = [...document.querySelectorAll('app-inf app-activities app-activity')];
	let hash = {};

	activities = activities.map((activity) => {
		let userActivity = new window.Activity[activity.id]();

		userActivity.view = window.Framework.views[activity.getAttribute('view')];
		userActivity.id = activity.id;

		hash[activity.id] = userActivity;
		return userActivity;
	});

	return [activities, hash];
};


const ready = () => {
	customElements.define('app-view', View);
	customElements.define('app-activity', ActivityData);
	customElements.define('app-route', Route);

	window.Framework.views = loadViews();
	window.Framework.routing = loadRouting();
	[window.Framework.activities.list, window.Framework.activities.hash] = loadActivities();

	hashChange();
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


window.Activity = {};
window.Framework = {};
window.Framework.Activity = Activity;
window.Framework.ActivityData = ActivityData;
window.Framework.View = View;
window.Framework.Route = Route;
window.Framework.views = [];
window.Framework.routing = [];
window.Framework.activities = {
	list: [],
	hash: {}
};

window.addEventListener("hashchange", hashChange);
window.addEventListener("load", ready);
