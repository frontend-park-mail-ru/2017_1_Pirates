'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Input = class extends window.Framework.ComponentStub.Input {
		constructor() {
			super();
			this.userValidators = null;
		}


		get valid() {
			if (this.userValidators) {
				return this.userValidators.isValid(false);
			}

			return true;
		}


		alert() {
			const input = this.view.querySelector('input');
			input.className = 'alert';

			window.setTimeout(() => {
				input.className = '';
			}, 500);
		}


		onErroneousChange(value) {
			if (value) {
				this.view.classList.add('erroneous');
			} else {
				this.view.classList.remove('erroneous');
			}

			return value;
		}


		onTextChange(value) {
			if (this.userValidators) {
				this.userValidators.validate(value);
			}

			return value;
		}


		onPasswordChange(value) {
			const input = this.view.querySelector('input');

			if (value) {
				input.setAttribute('type', 'password');
			} else {
				input.setAttribute('type', 'text');
			}

			return value;
		}


		onValidatesChange(validates) {
			if (validates.length > 0) {
				this.userValidators = new window.Framework.ValidatorChain(validates.replace(' ', '').split(','));
				this.userValidators.onStateChange = () => {
					this.view.dispatchEvent(new CustomEvent('validate', { detail: this }));
				};

				return validates;
			}

			this.userValidators = null;
			return validates;
		}
	};

});
