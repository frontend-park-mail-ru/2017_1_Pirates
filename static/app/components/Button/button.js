'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Button = class extends window.Framework.ComponentStub.Button {
		constructor() {
			super();
		}

		onLinkChange(link) {
			if (link !== '') {
				this.view.children[0].onclick = () => {
					location.hash = link;
					/*
						ToDo: Make Framework route objects
					 */
				}
			}

			return link;
		}

		onSocialChange(condition) {
			console.log(typeof condition);

			/*if (condition !== null && condition !== 'false') {
				const btn = this.view.children[0];
				const classes = btn.getAttribute('class');
				btn.setAttribute('class', classes + ' btn-social');
			}*/

			return condition;
		}

		onInvertColorsChange(value) {
			if (value) {

			}

			return value;
		}
	};

});
