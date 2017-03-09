'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Input = class extends window.Framework.ComponentStub.Input {
		constructor() {
			super();
			//this.chain = new window.Framework.ValidatorChain()
		}

		get valid() {
			return false;
		}

		onTextChange(value) {
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
	};

});
