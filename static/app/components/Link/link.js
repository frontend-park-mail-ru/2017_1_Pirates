'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Link = class extends window.Framework.ComponentStub.Link {
		constructor() {
			super();

			// window.setTimeout(() => {
			// 	this.setup();
			// }, 100);
		}

		// setup() {
		// 	const button = this.view.querySelector('.btn');
		// 	button.addEventListener('mouseout', () => {
		// 		button.blur();
		// 	});
		// }
	}
});

