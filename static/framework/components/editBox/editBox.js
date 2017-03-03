'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.EditBox = class extends window.Framework.ComponentStub.EditBox {
		constructor() {
			super();
		}

		textChange(text) {
			alert(`New value: "${text}"`);
		}
	};

});

