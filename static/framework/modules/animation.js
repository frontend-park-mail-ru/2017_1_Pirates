'use strict';


window.Framework.Animation = class Animation {
	constructor(activity) {
		this.activity = activity;
	}

	apply() {
		this.end();
	}

	remove() {
	}

	end() {
		document.querySelector('app-content').dispatchEvent(new Event('_AnimationEnd'));
	}

	get view() {
		return this.activity.view;
	}
};
