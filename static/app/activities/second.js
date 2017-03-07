'use strict';


window.Activity.SecondActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	};

	onEnter(args) {
		window.setInterval(() => {
			const loading = this.view.queryComponent('loading');
			loading.visible = !loading.visible;
		}, 5000);
	};

};
