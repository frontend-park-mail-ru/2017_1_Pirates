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
		window.setTimeout(() => {
			window.Network.current({}, (status, response) => {
				if (response.status === window.ErrorCodes.SUCCESS) {
					window.currentUser = response;
					// ToDo: Trigger text change
					return;
				}

				if (response.status === window.ErrorCodes.SESSION_INVALID) {
					window.currentUser = null;
					// ToDo: Trigger unauthorized text
				}
			});
		}, 1000);
	};

};
