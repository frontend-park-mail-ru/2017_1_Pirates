'use strict';


window.Activity.LoginActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	};


	onEnter(args) {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	};

};
