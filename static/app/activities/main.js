'use strict';


window.Activity.MainActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#singlePlayer', 'click', 'onSingleClick');
		this.bind('#multiPlayer', 'click', 'onMultiClick');
	};


	onSingleClick(event) {
		window.Route.SinglePlayerRoute.navigate();
	};


	onMultiClick(event) {
		window.Route.MultiPlayerRoute.navigate();
	};


	onEnter(args) {
		/*window.setInterval(() => {
			const loading = this.view.queryComponent('#loading');
			loading.visible = !loading.visible;
		}, 3000);*/
	};

};
