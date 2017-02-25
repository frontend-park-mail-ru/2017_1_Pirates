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

	onBeforeEnter() {
		if (this.view) {
			let content = document.querySelector('app-content');
			content.innerHTML = '';
			content.appendChild(this.view);
		}
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

	render() {
		if (this.hasAttribute('inherits')) {
			const base = window.Framework.views[this.getAttribute('inherits')];

			const content = this.innerHTML;
			this.innerHTML = base.innerHTML;
			this.querySelector('view-yield').outerHTML = content;
			this.removeAttribute('inherits');
		}

		const rowsIter = (parent) => {
			[...parent.children].forEach((element) => {

				if (element.tagName === 'VIEW-ROW') {
					const maxWidth = element.getAttribute('width') || 12;
					const children = [...element.children].filter((el) => {
						rowsIter(el);
						return el.tagName === 'VIEW-COLUMN';
					});

					let width = 0;
					let free = 0;

					children.forEach((column) => {
						width += column.getAttribute('width') || 0;
						free += (column.hasAttribute('width')) ? (0) : (0);
					});

					let diff = maxWidth - width;
					if (diff < 0) diff = 0;
					let med = diff / free;

					const channel = () => {
						return Math.floor(195 + Math.random() * 60);
					};

					children.forEach((column) => {
						column.style.flexGrow = column.getAttribute('width') || med;

						if (window.Framework.debug) {
							column.style.backgroundColor = `rgb(${channel()},${channel()},${channel()})`;
						}
					});
				}

			});
		};

		rowsIter(this);
	}
}


class ViewInclude extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		const includes = window.Framework.views[this.getAttribute('view')];
		this.outerHTML = includes.innerHTML;
	}
}


class ViewRow extends HTMLElement {
	constructor() {
		super();
	}

	render() {

	}
}


class ViewColumn extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		const parent = this.parentNode;
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
}


const loadViews = () => {
	let views = {};

	[...document.querySelectorAll('link[rel=import]')].forEach((link) => {
		let view = link.import.querySelector('app-view');
		views[view.id] = view;
	});

	return views;
};


const renderViews = () => {
	Object.keys(window.Framework.views).forEach((id) => {
		window.Framework.views[id].render();
	});

	Object.keys(window.Framework.views).forEach((id) => {
		[...window.Framework.views[id].querySelectorAll('view-include')].forEach((include) => {
			include.render();
		})
	});
};


const loadRouting = () => {
	return [...document.querySelectorAll('app-routing app-route')].sort((a, b) => {
		return a.length - b.length;
	});
};


const loadActivities = () => {
	let activities = {};

	[...document.querySelectorAll('app-inf app-activities app-activity')].forEach((activity) => {
		let userActivity = new window.Activity[activity.id]();

		userActivity.view = window.Framework.views[activity.getAttribute('view')];
		userActivity.id = activity.id;

		activities[activity.id] = userActivity;
		return userActivity;
	});

	return activities;
};


const ready = () => {
	customElements.define('app-view', View);
	customElements.define('app-activity', ActivityData);
	customElements.define('app-route', Route);
	customElements.define('view-include', ViewInclude);
	customElements.define('view-row', ViewRow);
	customElements.define('view-column', ViewColumn);

	window.Framework.views = loadViews();
	window.Framework.routing = loadRouting();
	window.Framework.activities = loadActivities();

	renderViews();
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
window.Framework.views = {};
window.Framework.routing = [];
window.Framework.activities = {};
window.Framework.debug = true;

window.addEventListener("hashchange", hashChange);
window.addEventListener("load", ready);
