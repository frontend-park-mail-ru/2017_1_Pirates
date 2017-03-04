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
		const event = new Event('AnimationEnd');
		this.view.dispatchEvent(event);
	}

	get view() {
		return this.activity.view;
	}
};
