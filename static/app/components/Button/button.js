'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Button = class extends window.Framework.ComponentStub.Button {
		constructor() {
			super();
		}

		linkByButton(link) {
			if (link !== '') {
				this.view.children[0].onclick = () => {
					location.hash = link;
				}
			}
		}

		setBackgroundColour(colourClass){
			if (colourClass === null) return;
			const btn = this.view.children[0];
			const classes = btn.getAttribute('class');
			btn.setAttribute('class', classes + ' ' + colourClass);
		}

		socialNets(condition) {
			console.log(condition);
			if (condition !== null && condition !== 'false') {
				const btn = this.view.children[0];
				const classes = btn.getAttribute('class');
				btn.setAttribute('class', classes + ' btn-social');
				console.log(btn);
			}
		}
	};

});
