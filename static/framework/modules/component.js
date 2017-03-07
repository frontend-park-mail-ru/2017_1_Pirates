'use strict';


window.Framework.ComponentView = class ComponentView extends HTMLElement {
	constructor() {
		super();
	}

	get id() {
		return `${this.parentNode.getAttribute('id')}__ComponentView`;
	}

	render() {
		window.Framework.View.renderTree(this);
	}

	queryComponentAll(query) {
		return window.Framework.View.queryComponentFromViewAll(this, query);
	}

	queryComponent(query) {
		return window.Framework.View.queryComponentFromView(this, query);
	}
};


window.Framework.Component = class Component {
	constructor() {
		this.__tag__ = null;
		this.__view__ = null;
		this.__id__ = null;
		this.validators = {};
	}

	get tag() {
		return this.__tag__;
	}

	set tag(value) {
		this.__tag__ = value;
	}

	get view() {
		return this.__view__;
	}

	set view(value) {
		this.__view__ = value;
		this.__createListeners__();
	}

	get id() {
		return this.__id__;
	}

	set id(value) {
		this.__id__ = value;
	}

	static toTyped(property, value) {
		switch (property.type) {

			case 'Boolean': {
				if (typeof value === 'boolean') return value;
				return value == 'true';
			} break;

			case 'Integer': {
				if (typeof value === 'number') return Math.floor(value);
				return parseInt(value);
			} break;

			case 'Float': {
				if (typeof value === 'number') return value;
				return parseFloat(value);
			} break;

			default: {
				return value;
			} break;

		}
	}

	setDefaults() {
		Object.keys(this.tag.properties).forEach((name) => {
			this[name] = window.Framework.Component.toTyped(
				this.tag.properties[name],
				this.tag.properties[name].default
			);
		});
	}


	static serializeComponents(element) {
		let obj = {};

		[...element.childNodes].forEach((node) => {
			if (node.__component__) {
				obj[node.__component__.id] = node.__component__.data;
			} else {
				obj = Object.assign(obj, window.Framework.Component.serializeComponents(node));
			}
		});

		return obj;
	}


	static deserializeComponents(element, data) {
		[...element.childNodes].forEach((node) => {
			if (node.__component__ && data[node.__component__.id]) {
				node.__component__.data = data[node.__component__.id];
			} else {
				window.Framework.Component.deserializeComponents(node, data);
			}
		});
	}


	get data() {
		let data = {};

		Object.keys(this.tag.properties).forEach((property) => {
			data[property] = this[property];
		});

		data.children = window.Framework.Component.serializeComponents(this.view);
		return data;
	}


	set data(data) {
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}

		Object.keys(data).forEach((property) => {
			if (property === 'children') {
				window.Framework.Component.deserializeComponents(this.view, data.children);
			} else {
				this[property] = data[property];
			}
		});
	}


	__setMappedPropertyValue__(selector, property, value) {
		[...this.view.querySelectorAll(selector)].forEach((element) => {
			if (property.startsWith('style.')) {
				element.style[property.slice('style.'.length)] = value;
			} else if (property.startsWith('attribute.')) {
				element.setAttribute(property.slice('attribute.'.length), value);
			} else {
				element[property] = value;
			}
		});
	}


	__createChangeListener__(name, selector, handlerName) {
		[...this.view.querySelectorAll(selector)].forEach((element) => {

			const validateProperty = (event) => {
				this.__validateProperty__(name, event.target.value, handlerName);
			};

			element.addEventListener('change', validateProperty);
			element.addEventListener('keyup', (event) => {
				window.setTimeout(() => {
					validateProperty(event);
				}, 1000);
			});

		});
	}


	__defaultValidateHandler__() {
	}


	__createListeners__() {
	}


	__validateProperty__(name, value, handlerName, maps, mapsSelector, mapsProperty) {
		this.validators[name].chain.onStateChange = (chain) => {
			this[this.validators[name].handler || '__defaultValidateHandler__'](chain);
		};
		value = window.Framework.Component.toTyped(this.tag.properties[name], value);
		this.validators[name].chain.validate(value);

		if (typeof this[handlerName || '__defaultHandler__'] === 'function') {
			const newValue = this[handlerName || '__defaultHandler__'](value, name);

			if (newValue !== undefined) {
				this[`__${name}__`] = newValue;
			}
		} else {
			this[`__${name}__`] = value;
		}

		if (maps) {
			this.__setMappedPropertyValue__(mapsSelector, mapsProperty, value);
		}
	}


	static createPropertyStub(name, property) {
		return `
			get ${name}() {
				return this.__${name}__;
			}
			set ${name}(value) {
				this.__validateProperty__(
					'${name}',
					value,
					'${property.handlerName}',
					${property.maps !== undefined},
					'${(property.maps || {}).selector}',
					'${(property.maps || {}).property}'
				);
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
		let listeners = [];

		Object.keys(componentTag.properties).forEach((name) => {
			values.push(`this.__${name}__ = null;`);

			if ((componentTag.properties[name].maps || {}).listen) {
				listeners.push(`this.__createChangeListener__(
					'${name}',
					'${(componentTag.properties[name].maps || {}).selector}',
					'${componentTag.properties[name].handlerName}'
				);`);
			}

			properties.push(window.Framework.Component.createPropertyStub(name, componentTag.properties[name]));
		});

		const classProtoConstructor = `
			const ${componentTag.id} = class extends window.Framework.Component {
				constructor() {
					super();
					${values.join('\n')}
				}
				__createListeners__() {
					${listeners.join('\n')}
				}
				${properties.join('\n')}
			};
			${componentTag.id};`;

		return eval(classProtoConstructor);
	};
};


window.Framework.ComponentTag = class ComponentTag extends HTMLElement {
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

			if (propertyTag.hasAttribute('maps')) {
				property.maps = {};
				const maps = propertyTag.getAttribute('maps').split('@');
				property.maps.selector = maps[0];
				property.maps.property = maps[1];
				property.maps.listen = propertyTag.hasAttribute('listen');
			}

			property.validates = (propertyTag.getAttribute('validates') || '').replace(' ', '').split(',');
			property.validateHandler = propertyTag.getAttribute('validateHandler') || '__defaultValidateHandler__';
			property.dataFlow = propertyTag.getAttribute('data-flow');
			// ToDo: DataFlow

			this.__properties__[propertyTag.getAttribute('name')] = property;
		});

		window.Framework.ComponentStub[this.getAttribute('id')] = window.Framework.Component.createStub(this);
		window.Framework.componentTags[this.getAttribute('tag')] = this;
	}

	get name() {
		return this.getAttribute('tag');
	}

	get viewId() {
		return `${this.getAttribute('id')}__ComponentView`
	}

	get properties() {
		return this.__properties__;
	}
};
