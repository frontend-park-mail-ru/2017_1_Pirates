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
		const userLink = this.view.queryComponent('#user');
		userLink.visible = false;

		window.setTimeout(() => {
			window.Network.current({}, (status, response) => {
				if (response.status === window.ErrorCodes.SUCCESS) {
					window.currentUser = response;
					userLink.text = response.login;
					userLink.visible = true;
					return;
				}

				if (response.status === window.ErrorCodes.SESSION_INVALID) {
					window.currentUser = null;
					userLink.text = 'Вы не авторизованы';
					userLink.visible = true;
				}
			});
		}, 1000);
	};

};
