'use strict';


window.Activity.GameActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#back', 'click', 'onBackClick');
	}


	onBackClick() {
		window.Route.MainRoute.navigate();
	}


	onEnter() {
	}


	onSingle() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	}


	onMulti() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	}

};
