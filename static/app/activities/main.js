'use strict';


window.Activity.MainActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#singlePlayer', 'click', 'onSingleClick');
		this.bind('#multiPlayer', 'click', 'onMultiClick');
		this.bind('#user', 'click', 'onUserClick');
	}


	onSingleClick() {
		window.Route.SinglePlayerRoute.navigate();
	}


	onMultiClick() {
		if (window.currentUser) {
			window.Route.MultiPlayerRoute.navigate();
		} else {
			window.Route.LoginRoute.navigate();
		}
	}


	onUserClick() {
		if (window.currentUser) {
			// ToDo: User profile
		} else {
			window.Route.LoginRoute.navigate();
		}
	}


	onEnter() {
		const back = this.view.queryComponent('#back');
		back.visible = false;

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
	}

};
