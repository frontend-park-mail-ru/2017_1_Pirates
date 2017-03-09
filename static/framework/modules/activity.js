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
		const content = document.querySelector('app-content');

		if (!animation) {
			content.dispatchEvent(new Event('AnimationEnd'));
			return;
		}

		window.Framework.animating = true;
		content.addEventListener('_AnimationEnd', () => {
			animation.remove();
			content.dispatchEvent(new Event('AnimationEnd'));
		}, {once: true});

		animation.apply(reverse);
	}

	onBeforeEnter() {
		if (this.view) {
			const content = document.querySelector('app-content');

			while(content.firstChild) {
				content.removeChild(content.firstChild);
			}

			content.appendChild(this.view);
			this.fireAnimation(this.enterAnimation, false);
		}
	}

	onBeforeLeave() {
		if (this.view) {
			this.fireAnimation(this.leaveAnimation, true);
		}
	}

	onEnter() {
	}

	onLeave() {
	}

	onSetupListeners() {
	}


	bind(componentSelector, eventType, handlerName) {
		window.setTimeout(() => {
			[...this.view.queryComponentAll(componentSelector)].forEach((component) => {
				component.view.addEventListener(eventType, (event) => {
					this[handlerName](event);
				});
			});
		}, 100);
	}
};
