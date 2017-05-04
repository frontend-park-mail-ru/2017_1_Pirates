'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.TestButton = class extends window.Framework.ComponentStub.TestButton {
		constructor() {
			super();
		}

		textChange(text) {
			this.view.innerHTML = `<br>Text of #${this.id} changed! New value: '${text}'.`;
			return text;
		}
	};

});

