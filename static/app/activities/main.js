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
		console.log(window.ErrorCodes.SUCCESS);

		window.Network.current({}, (status, response) => {
			console.log(status, response);
		});
	};

};
