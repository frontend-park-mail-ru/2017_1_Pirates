'use strict';


window.Activity.GameActivity = class extends window.Framework.Activity {

	constructor() {
		super();
		//this.bind('button', 'click', 'onButtonClick');
	};


	onEnter(args) {
	};


	onSingle(args) {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	};


	onMulti(args) {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	};

};
