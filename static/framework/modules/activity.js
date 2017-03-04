'use strict';


window.Framework.ActivityTag = class ActivityTag extends HTMLElement {
	constructor() {
		super();
	}
};


window.Framework.Activity = class Activity {
	constructor() {
		this.view = null;
		this.enterAnimation = null;
		this.leaveAnimation = null;
	}

	fireAnimation(animation, reverse) {
		if (!animation) {
			return;
		}

		animation.apply(this.view, reverse || false);
		this.view.addEventListener('AnimationEnd', () => {
			animation.remove(this.view);
		});
	}

	onBeforeEnter() {
		if (this.view) {
			let content = document.querySelector('app-content');
			content.innerHTML = '';
			content.appendChild(this.view);

			this.fireAnimation(this.enterAnimation);
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
