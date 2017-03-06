/**
 * Created by Vileven on 06.03.17.
 */

window.addEventListener('CreateComponents', () => {

	window.Component.TButton = class extends window.Framework.ComponentStub.TButton {
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
			if (condition !== null && condition) {
				const btn = this.view.children[0];
				const classes = btn.getAttribute('class');
				btn.setAttribute('class', classes + ' btn-social');
				console.log(btn.firstChild);
			}
		}
	};

});
