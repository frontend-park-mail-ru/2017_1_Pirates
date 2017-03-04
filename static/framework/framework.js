'use strict';


const loadViews = () => {
	let views = {};

	[...document.querySelectorAll('link[rel=import]')].forEach((link) => {
		let view = link.import.querySelector('app-view, component-view');
		if (view !== null) views[view.id] = view;
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


const renderComponents = () => {
	[...document.querySelectorAll('link[rel=import]')].forEach((link) => {
		let component = link.import.querySelector('component-info');

		if (component) {
			component.render();
		}
	});
};


const loadRouting = () => {
	return [...document.querySelectorAll('app-routing app-route')].sort((a, b) => {
		return a.length - b.length;
		// ToDo: тут что-то необычное
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
	customElements.define('app-view', window.Framework.View);
	customElements.define('app-activity', window.Framework.ActivityTag);
	customElements.define('app-route', window.Framework.Route);
	customElements.define('view-include', window.Framework.ViewInclude);
	customElements.define('view-row', window.Framework.ViewRow);
	customElements.define('view-column', window.Framework.ViewColumn);
	customElements.define('component-view', window.Framework.ComponentView);
	customElements.define('component-info', window.Framework.ComponentTag);

	window.Framework.views = loadViews();
	window.Framework.routing = loadRouting();
	window.Framework.activities = loadActivities();

	renderComponents();

	const event = new Event('CreateComponents');
	window.dispatchEvent(event);

	/*Object.keys(window.Component).forEach((name) => {
		window.Component[name].rendered = true;
	});*/

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


window.addEventListener("hashchange", hashChange);
window.addEventListener("load", ready);
