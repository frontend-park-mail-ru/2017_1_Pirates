'use strict';


window.Activity.ScoresActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	}


	onEnter() {
		const table = this.view.queryComponent('#score');

		table.list = [
			{
				user: "lol",
				score: 13
			},
			{
				user: "kek",
				score: 14
			},
			{
				user: "cheburek",
				score: 1488
			},
		]
	}

};
