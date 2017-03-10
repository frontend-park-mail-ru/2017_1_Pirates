'use strict';


window.Activity.MainActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#singlePlayer', 'click', 'onSingleClick');
		this.bind('#multiPlayer', 'click', 'onMultiClick');
		this.bind('#user', 'click', 'onUserClick');
		this.bind('#scores', 'click', 'onScoresClick');
		this.bind('#help', 'click', 'onHelpClick');
	}


	onHelpClick() {
		window.Route.HelpRoute.navigate();
	}


	onScoresClick() {
		window.Route.ScoresRoute.navigate();
	}


	onSingleClick() {
		window.Route.SinglePlayerRoute.navigate();
	}


	onMultiClick() {
		if (window.currentUser) {
			window.Route.MultiPlayerRoute.navigate();
		} else {
			window.navigatedTo = window.Route.MultiPlayerRoute;
			window.Route.LoginRoute.navigate();
		}
	}


	onUserClick() {
		window.navigatedTo = null;

		if (window.currentUser) {
			// ToDo: User profile
			window.Route.LogoutRoute.navigate();
		} else {
			window.Route.LoginRoute.navigate();
		}
	}


	onEnter() {
		const back = this.view.queryComponent('#back');
		back.visible = false;

		const scores = this.view.queryComponent('#scores');
		scores.visible = true;

		const userLink = this.view.queryComponent('#user');
		userLink.visible = false;

		window.setTimeout(() => {
			window.Network.current({}, (status, response) => {
				if (response.status === window.ErrorCodes.SUCCESS) {
					window.currentUser = response;
					console.log(response);
					userLink.text = `${response.login} (Выход)`;
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


	onLeave() {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	}

};
