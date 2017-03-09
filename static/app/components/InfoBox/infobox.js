'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.InfoBox = class extends window.Framework.ComponentStub.InfoBox {

		constructor() {
			super();
			this.clear();
		}


		update() {
			const updateArray = (name) => {
				const array = this.view.querySelector(`.${name}`);
				array.innerHTML = '';

				this[`${name}`].forEach((item) => {
					const li = document.createElement('li');
					li.innerHTML = item;
					array.appendChild(li);
				});
			};


			updateArray('texts');
			updateArray('oks');
			updateArray('warnings');
			updateArray('errors');
		}


		addStatusMessage(status, text) {
			const array = this[`${status}s`];
			array.push(text);
			this.update();
		}


		clear() {
			this.texts = [];
			this.oks = [];
			this.warnings = [];
			this.errors = [];
		}


		onTextChange(value) {
			this.clear();

			if (value != null) {
				if (typeof value === 'string') {
					value = [value];
				}

				value.forEach((line) => {
					this.texts.push(line);
				});
			}

			this.update();
			return value;
		}


		onVisibleChange(value) {
			if (this.visible) {
				this.view.style.opacity = 1;
			} else {
				this.view.style.opacity = 0;
			}

			return value;
		}

	};

});
