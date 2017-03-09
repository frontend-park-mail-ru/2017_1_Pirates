'use strict';


window.Activity.LoginActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#submit', 'click', 'onSubmitClick');
		this.bind('input', 'keydown', 'onInputKeydown');
	};


	onInputKeydown(event) {
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');

		email.erroneous = false;
		password.erroneous = false;
	}


	onSubmitClick(event) {
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');

		window.Network.login({
			login_or_email: email.text,
			password: password.text
		}, (httpStatus, response) => {
			if (response.status === window.ErrorCodes.BAD_LOGIN_OR_PASSWORD) {
				email.erroneous = true;
				password.erroneous = true;
				email.alert();
			}
		});
	}


	onPasswordValidate(event) {
		//event.detail.valid;
	}


	onEnter(args) {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	};

};
