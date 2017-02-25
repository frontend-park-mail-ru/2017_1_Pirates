'use strict';


window.Framework.ActivityTag = class ActivityTag extends HTMLElement {
	constructor() {
		super();
	}
};


window.Framework.Activity = class Activity {
	constructor() {
		this.view = null;
	}

	onBeforeEnter() {
		if (this.view) {
			let content = document.querySelector('app-content');
			content.innerHTML = '';
			content.appendChild(this.view);
		}
	}

	onEnter(args) {
	}

	onLeave(args) {
	}

	onSetupListeners() {
	}
};
