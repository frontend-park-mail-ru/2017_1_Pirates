'use strict';


window.Activity.ThankYouActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#login', 'click', 'onLoginClick');
	}


	onLoginClick() {
		window.Route.LoginRoute.navigate({ login: this.login });
	}


	onEnter(args) {
		this.login = args.login;
	}

};
