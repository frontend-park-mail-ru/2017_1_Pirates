'use strict';


window.Activity.GameActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#back', 'click', 'onBackClick');
	}


	onBackClick() {
		window.Route.MainRoute.navigate();
	}


	onSingle() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
		this.view.queryComponent('#back').back = false;

		JSWorks._in_game_ = true;
	}


	onMulti() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
		this.view.queryComponent('#back').back = false;
	}


	onLeave() {
		JSWorks._in_game_ = false;
	}

};
