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
};


window.Framework.Component = class Component {
	constructor() {
		this.__tag__ = null;
		this.__view__ = null;
		this.__id__ = null;
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

		/*
			ToDo: Add necessary hooks
		 */
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
				return value == 'true';
			} break;

			case 'Integer': {
				return parseInt(value);
			} break;

			case 'Float': {
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


	setMappedPropertyValue(selector, property, value) {
		[...this.view.querySelectorAll(selector)].forEach((element) => {
			if (property.startsWith('style.')) {
				element.style[property.slice('style.'.length)] = value;
			} else {
				element[property] = value;
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
					const newValue = this.${property.handlerName || '__defaultHandler__'}(value, '${name}');
					if (newValue !== undefined) {
						this.__${name}__ = newValue;
					}
				} else {
					this.__${name}__ = value;
				}
				if (${property.maps !== undefined}) {
					this.setMappedPropertyValue(
						"${(property.maps || {}).selector}",
						"${(property.maps || {}).property}",
						this.__${name}__
					);
				}
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
			properties.push(window.Framework.Component.createPropertyStub(name, componentTag.properties[name]));
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
			}

			property.validates = (propertyTag.getAttribute('validates') || '').replace(' ', '').split(',');
			// ToDo: Validators

			property.dataFlow = propertyTag.getAttribute('data-flow');
			// ToDo: DataFlow

			this.__properties__[propertyTag.getAttribute('name')] = property;
		});

		window.Framework.ComponentStub[this.getAttribute('id')] = window.Framework.Component.createStub(this);
		window.Framework.componentTags[this.getAttribute('tag')] = this;
	}

	get viewId() {
		return `${this.getAttribute('id')}__ComponentView`
	}

	get properties() {
		return this.__properties__;
	}
};
