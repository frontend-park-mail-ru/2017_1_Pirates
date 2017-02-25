'use strict';


class ActivityTag extends HTMLElement {
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

	static renderTree(parent) {
		[...parent.children].forEach((element) => {
			if (typeof element.render === 'function') {
				element.render();
			}

			if (element.tagName.startsWith('C-')) {
				const componentTagName = element.tagName.slice('C-'.length).toLowerCase();
				let componentTag = window.Framework.componentTags[componentTagName];
				let component = new window.Component[componentTag.id]();

				component.tag = componentTag;
				component.setDefaults();

				console.dir(component);

				Object.keys(componentTag.properties).forEach((name) => {
					if (element.hasAttribute(name)) {
						component[name] = element.getAttribute(name);
					}
				});

				/*
				 ToDo: Add event binding
				 */
			}

			View.renderTree(element);
		});
	}

	render() {
		if (this.hasAttribute('inherits')) {
			const base = window.Framework.views[this.getAttribute('inherits')];

			const content = this.innerHTML;
			this.innerHTML = base.innerHTML;
			this.querySelector('view-yield').outerHTML = content;
			this.removeAttribute('inherits');
		}

		View.renderTree(this);
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
		this.medWidth = 1;
	}

	getUsedWidthAndSpace(children) {
		let width = 0;
		let free = 0;

		children.forEach((column) => {
			width += column.getAttribute('width') || 0;
			free += (column.hasAttribute('width')) ? (0) : (0);
		});

		return [width, free];
	}

	static debugRandomRGBColor() {
		const randChan = () => {
			return Math.floor(195 + Math.random() * 60);
		};

		return `rgb(${randChan()},${randChan()},${randChan()})`;
	}

	render() {
		if (this.hasAttribute('fill')) {
			this.style.overflow = 'auto';
			this.style.flex = 1;
			return;
		}

		const maxWidth = this.getAttribute('width') || 12;
		const children = [...this.children].filter((el) => {
			return el.tagName === 'VIEW-COLUMN';
		});

		let width;
		let free;
		[width, free] = this.getUsedWidthAndSpace(children);

		let diff = maxWidth - width;
		if (diff < 0) diff = 0;
		this.medWidth = diff / free;
	}
}


class ViewColumn extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		this.style.flexGrow = this.getAttribute('width') || this.parentElement.medWidth || 1;

		if (window.Framework.debug) {
			this.style.backgroundColor = ViewRow.debugRandomRGBColor();
		}
	}
}


class ComponentView extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		View.renderTree(this);
	}
}


class Component {
	constructor() {
		this.tag = null;
	}

	setDefaults() {
		Object.keys(this.tag.properties).forEach((name) => {

			switch (this.tag.properties[name].type) {

				case 'Boolean': {
					this[name] = this.tag.properties[name].default == 'true';
				} break;

				case 'Integer': {
					this[name] = parseInt(this.tag.properties[name].default);
				} break;

				case 'Float': {
					this[name] = parseFloat(this.tag.properties[name].default);
				} break;

				default: {
					this[name] = this.tag.properties[name].default;
				} break;

			}

		});
	}


	static createPropertyStub(name, property) {
		return `
			get ${name}() {
				return this.__${name}__;
			}
			set ${name}(value) {
				if (typeof this.${property.handlerName || '__defaultHandler__'} === 'function') {
					console.log('Property set!', value);
					const newValue = this.${property.handlerName || '__defaultHandler__'}(value, '${name}');
					if (newValue !== undefined) {
						this.__${name}__ = newValue;
					}
					return;
				}
				this.__${name}__ = value;
			}`;
	}

	/*
		I fully understand the whole depravity of this code, but if anyone could figure out
		how to construct an ES6 class in dynamics without eval() please let me know,
		or, what's better, change this without breaking everything else.
	 */

	static createStub(componentTag) {
		let properties = [];
		let values = [];

		Object.keys(componentTag.properties).forEach((name) => {
			values.push(`this.__${name}__ = null;`);
			properties.push(Component.createPropertyStub(name, componentTag.properties[name]));
		});

		const classProtoConstructor = `
			const ${componentTag.id} = class extends window.Framework.Component {
				constructor() {
					super();
					${values.join('\n')}
				}
				${properties.join('\n')}
			};
			${componentTag.id};`;

		return eval(classProtoConstructor);
	};
}


class ComponentTag extends HTMLElement {
	constructor() {
		super();
		this.__properties__ = {};
	}

	render() {
		const view = this.querySelector('component-view');
		view.setAttribute('id', this.viewId);
		this.__properties__ = {};

		[...this.querySelectorAll('component-properties component-property')].forEach((propertyTag) => {
			let property = {};

			property.handlerName = propertyTag.getAttribute('handler');  // OnPropertyChange will fire this
			property.default = propertyTag.getAttribute('default');
			property.type = propertyTag.getAttribute('type');

			this.__properties__[propertyTag.getAttribute('name')] = property;
		});

		window.Framework.ComponentStub[this.getAttribute('id')] = Component.createStub(this);
		window.Framework.componentTags[this.getAttribute('tag')] = this;
	}

	get viewId() {
		return `${this.getAttribute('id')}__ComponentView`
	}

	get properties() {
		return this.__properties__;
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
		let view = link.import.querySelector('app-view, component-view');
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
	customElements.define('app-activity', ActivityTag);
	customElements.define('app-route', Route);
	customElements.define('view-include', ViewInclude);
	customElements.define('view-row', ViewRow);
	customElements.define('view-column', ViewColumn);
	customElements.define('component-view', ComponentView);
	customElements.define('component-info', ComponentTag);

	window.Framework.views = loadViews();
	window.Framework.routing = loadRouting();
	window.Framework.activities = loadActivities();

	renderComponents();

	const event = new Event('CreateComponents');
	window.dispatchEvent(event);

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
window.Component = {};
window.Framework = {};
window.Framework.ComponentStub = {};
window.Framework.Activity = Activity;
window.Framework.ActivityTag = ActivityTag;
window.Framework.View = View;
window.Framework.ViewRow = ViewRow;
window.Framework.ViewColumn = ViewColumn;
window.Framework.ComponentView = ComponentView;
window.Framework.ComponentTag = ComponentTag;
window.Framework.Component = Component;
window.Framework.Route = Route;
window.Framework.views = {};
window.Framework.routing = [];
window.Framework.activities = {};
window.Framework.componentTags = {};
window.Framework.debug = true;

window.addEventListener("hashchange", hashChange);
window.addEventListener("load", ready);
