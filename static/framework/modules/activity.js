'use strict';


window.Framework.ActivityTag = class ActivityTag extends HTMLElement {
	constructor() {
		super();
	}
};


window.Framework.Activity = class Activity {
	constructor() {
		this.view = null;
		this.tag = null;
		this.enterAnimation = null;
		this.leaveAnimation = null;
	}

	fireAnimation(animation, reverse) {
		console.log('animation fired', animation, reverse);
		const content = document.querySelector('app-content');

		if (!animation) {
			content.dispatchEvent(new Event('AnimationEnd'));
			return;
		}

		animation.apply(reverse);
		content.addEventListener('AnimationEnd', () => {
			animation.remove();
			console.log('removed listener');

			if (reverse) {
				animation.view.style.opacity = 0;
				return;
			}

			animation.view.style.opacity = 1;
		}, {once: true});
	}

	onBeforeEnter() {
		if (this.view) {
			const content = document.querySelector('app-content');

			content.innerHTML = '';
			content.appendChild(this.view);
			this.view.style.opacity = 0;

			window.setTimeout(() => {
				this.fireAnimation(this.enterAnimation, false);
			}, 1);
		}
	}

	onBeforeLeave() {
		if (this.view) {
			this.fireAnimation(this.leaveAnimation, true);
		}
	}

	onEnter(args) {
	}

	onLeave() {
	}

	onSetupListeners() {
	}
};
