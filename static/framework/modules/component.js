'use strict';


window.Framework.ComponentView = class ComponentView extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		window.Framework.View.renderTree(this);
	}
};


window.Framework.Component = class Component {
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
