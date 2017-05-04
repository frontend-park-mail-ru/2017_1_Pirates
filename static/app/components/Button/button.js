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
				};
			}

			return link;
		}


		onSocialChange(condition) {
			if (condition) {
				const btn = this.view.querySelector('.btn');
				const classes = btn.getAttribute('class');
				btn.setAttribute('class', classes + ' btn-social');
			}

			return condition;
		}


		onVKChange(value) {
			return value;
		}


		onInlineChange(value) {
			if (value) {
				this.view.parentNode.style.display = 'inline-block';
			} else {
				this.view.parentNode.style.display = 'block';
			}

			return value;
		}


		onEnabledChange(value) {
			if (value) {
				this.view.classList.remove('disabled');
			} else {
				this.view.classList.add('disabled');
			}

			return value;
		}
	};

});
