'use strict';


window.Framework.View = class View extends HTMLElement {
	constructor() {
		super();
	}

	static queryComponentFromViewAll(view, query) {
		query = query.replace(/[.#\w][\S]+/g, (queryPart) => {
			if ((queryPart[0] != '#') && (queryPart[0] != '.') && (queryPart[0] != '[')) {
				return `c-${queryPart}`;
			}

			return queryPart;
		});

		let result = [];

		[...view.querySelectorAll(query)].forEach((element) => {
			if (element.__component__) {
				result.push(element.__component__);
			}
		});

		return result;
	}

	static queryComponentFromView(view, query) {
		return view.queryComponentAll(query)[0];
	}

	queryComponentAll(query) {
		return window.Framework.View.queryComponentFromViewAll(this, query);
	}

	queryComponent(query) {
		return window.Framework.View.queryComponentFromView(this, query);
	}

	static renderTree(parent) {
		[...parent.children].forEach((element) => {
			if (typeof element.render === 'function') {
				element.render();
			}

			if (element.tagName.startsWith('C-')) {
				[...element.querySelectorAll('component-view')].forEach((view) => {
					view.outerHTML = '';
				});

				const componentTagName = element.tagName.slice('C-'.length).toLowerCase();
				let componentTag = window.Framework.componentTags[componentTagName];
				let component = new window.Component[componentTag.id]();

				const view = window.Framework.views[componentTag.viewId].cloneNode(true);
				view.removeAttribute('id');
				element.appendChild(view);

				component.tag = componentTag;
				component.view = view;
				component.id = element.id;

				element.style.display = 'block';
				element.__component__ = component;
			}

			window.Framework.View.renderTree(element);

			if (element.__component__) {
				const component = element.__component__;

				Object.keys(component.tag.properties).forEach((name) => {
					component.validators[name] = {
						handler: component.tag.properties[name].validateHandler,
						chain: new window.Framework.ValidatorChain(
							component.tag.properties[name].validates
						)
					};
				});

				component.setDefaults();

				Object.keys(component.tag.properties).forEach((name) => {
					if (element.hasAttribute(name)) {
						component[name] = element.getAttribute(name);
					}
				});

				/*
				 ToDo: Add event binding
				 */
			}
		});
	}

	render() {
		if (this.hasAttribute('inherits')) {
			const base = window.Framework.views[this.getAttribute('inherits')];

			const content = this.innerHTML;
			this.innerHTML = base.innerHTML;
			this.removeAttribute('inherits');

			const yields = this.querySelector('view-yield');
			if (yields) {
				yields.outerHTML = content;
			}
		}

		window.Framework.View.renderTree(this);
	}
};


window.Framework.ViewInclude = class ViewInclude extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		if (this.hasAttribute('rendered')) {
			return;
		}

		const includes = window.Framework.views[this.getAttribute('view')].cloneNode(true);
		const parameter = includes.querySelector('view-parameter');

		if (parameter) {
			parameter.outerHTML = this.innerHTML;
		}

		this.innerHTML = includes.innerHTML;
		this.setAttribute('rendered', true);

		window.Framework.View.renderTree(this);
	}
};


window.Framework.ViewRow = class ViewRow extends HTMLElement {
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
};


window.Framework.ViewColumn = class ViewColumn extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		this.style.flexGrow = this.getAttribute('width') || this.parentElement.medWidth || 1;

		if (window.Framework.debug) {
			this.style.backgroundColor = window.Framework.ViewRow.debugRandomRGBColor();
		}
	}
};
