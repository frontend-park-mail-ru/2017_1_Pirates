'use strict';


window.Framework.ActivityTag = class ActivityTag extends HTMLElement {
	constructor() {
		super();
	}
};


window.Framework.Activity = class Activity {
	constructor() {
		super();
		this.view = null;
		this.animations = [];
	}

	onBeforeEnter() {
		if (this.view) {
			let content = document.querySelector('app-content');
			content.innerHTML = '';
			content.appendChild(this.view);
		}
	}

	onBeforeLeave() {

	}

	onEnter(args) {
	}

	onLeave(args) {
	}

	onSetupListeners() {
	}
};
