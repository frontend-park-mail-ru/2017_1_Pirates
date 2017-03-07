'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Input = class extends window.Framework.ComponentStub.Input {
		constructor() {
			super();
			this.chain = new window.Framework.ValidatorChain()
		}

		get valid() {
			return false;
		}

		onTextChange(value) {
			console.log(value);
			return value;
		}
	};

});
