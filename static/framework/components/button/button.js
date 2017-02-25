'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Button = class extends window.Framework.ComponentStub.Button {
		constructor() {
			super();
		}

		textChange(text) {
			alert(text);
		}
	};

});

