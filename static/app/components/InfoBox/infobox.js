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
			this.addStatusMessages(status, [text]);
		}


		addStatusMessages(status, messages) {
			const array = this[`${status}s`];

			messages.forEach((message) => {
				if (message && !this.__has__[message]) {
					array.push(message);
					this.__has__[message] = true;
				}
			});

			this.update();
		}


		clear() {
			this.texts = [];
			this.oks = [];
			this.warnings = [];
			this.errors = [];
			this.__has__ = {};
		}


		get empty() {
			const empty = (this.texts.length === 0) || (this.texts[0] === null);
			return empty && (this.oks.length === 0) && (this.warnings.length === 0) &&
				(this.errors.length === 0);
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
			if (value) {
				this.view.style.opacity = 1;
			} else {
				this.view.style.opacity = 0;
			}

			return value;
		}

	};

});
