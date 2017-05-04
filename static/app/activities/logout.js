'use strict';


window.Activity.LogoutActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	}

	onEnter() {
		window.setTimeout(() => {
			window.Network.logout({}, () => {
				window.Route.MainRoute.navigate();
			});
		}, 1000);
	}

};
