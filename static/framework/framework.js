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
			if (include.render) {
				include.render();
			}
		});
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
	const routes = [...document.querySelectorAll('app-routing app-route')].sort((a, b) => {
		return a.path.slice(1).split('__').length - b.path.slice(1).split('__').length;
	});

	routes.forEach((route) => {
		window.Route[route.id] = route;
	});

	return routes;
};


const loadActivities = () => {
	let activities = {};

	const addAnimation = (activity, state) => {
		if (activity.tag.hasAttribute(`animation-${state}`)) {
			const animName = activity.tag.getAttribute(`animation-${state}`);

			activity[`${state}Animation`] = new window.Animation[animName](
				activity,
				activity.tag.getAttribute(`animation-${state}-duration`)
			);
		}
	};

	[...document.querySelectorAll('app-inf app-activities app-activity')].forEach((activity) => {
		let userActivity = new window.Activity[activity.id]();

		userActivity.view = window.Framework.views[activity.getAttribute('view')];
		userActivity.id = activity.id;
		userActivity.tag = activity;
		addAnimation(userActivity, 'enter');
		addAnimation(userActivity, 'leave');

		activities[activity.id] = userActivity;
		return userActivity;
	});

	return activities;
};


/*const ready = () => {
	window.addEventListener()
};*/


const ready = () => {
	customElements.define('app-view', window.Framework.View);
	customElements.define('app-activity', window.Framework.ActivityTag);
	customElements.define('app-route', window.Framework.Route);
	customElements.define('app-backend', window.Framework.BackendTag);
	customElements.define('app-locale', window.Framework.LocaleTag);
	customElements.define('view-include', window.Framework.ViewInclude);
	customElements.define('view-row', window.Framework.ViewRow);
	customElements.define('view-column', window.Framework.ViewColumn);
	customElements.define('component-view', window.Framework.ComponentView);
	customElements.define('component-info', window.Framework.ComponentTag);

	window.addEventListener('SwaggerSpecLoad', () => {
		window.Framework.views = loadViews();
		window.Framework.routing = loadRouting();
		window.Framework.activities = loadActivities();

		renderComponents();
		window.dispatchEvent(new Event('CreateComponents'));

		renderViews();
		hashChange();
	});
};


const hashChange = () => {
	if (window.Framework.animating) {
		window.setTimeout(hashChange, 1000);
		return;
	}

	window.Framework.routing.some((route) => {
		let args = route.complies(document.location.hash);

		if (args) {
			route.fire(args);
			return true;
		}
	});
};


window.addEventListener('hashchange', hashChange);
window.addEventListener('WebComponentsReady', ready);
