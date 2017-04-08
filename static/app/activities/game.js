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

		JSWorks._game.scene.newGame();
		JSWorks._game.scene.inMenu = false;
	}


	onMulti() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
		this.view.queryComponent('#back').back = false;
	}


	onLeave() {
		JSWorks._game.scene.loose();
		JSWorks._game.scene.inMenu = true;
	}

};
