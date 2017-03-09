'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.Link = class extends window.Framework.ComponentStub.Link {
		constructor() {
			super();

			window.setTimeout(() => {
				const content = this.view.querySelector('.link-inner-container');
				content.addEventListener('click', () => {
					if (this.back) {
						window.history.back();
					}
				});
			}, 100);
		}

		onIconVisibleChange(value) {
			const icon = this.view.querySelector('.icon');

			if (value) {
				icon.style.visibility = 'visible';
			} else {
				icon.style.visibility = 'hidden';
			}

			return value;
		}

		onIconClassChange(value) {
			const icon = this.view.querySelector('.icon');
			icon.setAttribute('class', `${icon.getAttribute('class')} ${value}-icon`);
			return value;
		}

		onVisibleChange(value) {
			const content = this.view.querySelector('.link-inner-container');

			if (value) {
				content.style.opacity = 1;
			} else {
				content.style.opacity = 0;
			}

			return value;
		}

		onAlignChange(value) {
			let reversed = 'right';
			if (value === 'right') reversed = 'left';

			this.view.querySelector(`.possible-icon-${value}`).setAttribute('class',
				`possible-icon-${value} icon`);
			this.view.querySelector(`.possible-icon-${reversed}`).setAttribute('class',
				`possible-icon-${reversed}`);
			this.onIconClassChange(this.iconClass);

			return value;
		}
	}

});
