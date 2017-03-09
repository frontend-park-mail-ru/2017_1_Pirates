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
