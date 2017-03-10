'use strict';


window.Activity.ScoresActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	}


	onEnter() {
		const table = this.view.queryComponent('#score');

		window.Network.scores({}, (status, response) => {
			table.list = response;
		});
	}

};
