'use strict';


window.Activity.LoginActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#submit', 'click', 'onSubmitClick');
		this.bind('#signup', 'click', 'onSignUpClick');
		this.bind('input', 'keydown', 'onInputKeydown');
	}


	onSignUpClick() {
		window.Route.SignUpRoute.navigate();
	}


	onInputKeydown() {
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');

		email.erroneous = false;
		password.erroneous = false;
	}


	onSubmitClick() {
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');
		const submit = this.view.queryComponent('#submit');
		const errors = this.view.queryComponent('#errors');
		if (!submit.enabled) return;

		submit.enabled = false;
		errors.text = 'Пожалуйста, подождите...';

		window.Network.login({

			login_or_email: email.text,
			password: password.text

		}, (httpStatus, response) => {

			if (response.status === window.ErrorCodes.BAD_LOGIN_OR_PASSWORD) {
				email.erroneous = true;
				password.erroneous = true;

				errors.text = null;
				errors.addStatusMessage('error', 'Неправильный логин или пароль!');
				errors.visible = true;

				email.alert();
			}

			submit.enabled = true;
		});
	}


	onPasswordValidate() {
		//event.detail.valid;
	}


	onEnter() {
		const errors = this.view.queryComponent('#errors');

		errors.text = 'Для продолжения необходимо войти или создать аккаунт.';
		errors.visible = false;
	}

	onLeave() {
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');
		const errors = this.view.queryComponent('#errors');

		email.text = '';
		email.erroneous = false;

		password.text = '';
		password.erroneous = false;
	}

};