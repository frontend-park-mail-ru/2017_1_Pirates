'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.EditBox = class extends window.Framework.ComponentStub.EditBox {
		constructor() {
			super();
		}

		textChange(text) {
			const button = this.view.queryComponent('button');

			if (button) {
				button.text = `New value: "${text}"`;
			}

			return text;
		}

		textValidate(chain) {
			const oks = this.view.querySelector('.oks');
			const warnings = this.view.querySelector('.warnings');
			const errors = this.view.querySelector('.errors');

			oks.innerHTML = '';
			warnings.innerHTML = '';
			errors.innerHTML = '';

			if (chain.isValid()) {
				oks.innerHTML = 'I am valid!';
				return;
			}

			chain.warnings.forEach((warning) => {
				warnings.innerHTML += `${warning || ''}`;
			});

			chain.errors.forEach((error) => {
				errors.innerHTML += `${error || ''}`;
			});
		}
	};

});

