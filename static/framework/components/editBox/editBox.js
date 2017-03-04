'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.EditBox = class extends window.Framework.ComponentStub.EditBox {
		constructor() {
			super();
		}

		textChange(text) {
			//alert(`New value: "${text}"`);
			//console.dir(this.view);
			//console.log(this.view.queryComponent('#btn'));
			const button = this.view.queryComponent('button');

			if (button) {
				button.text = `New value: "${text}"`;
			};
		}
	};

});

