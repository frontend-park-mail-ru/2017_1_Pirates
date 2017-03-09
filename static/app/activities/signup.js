'use strict';


window.Activity.SignUpActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		this.bind('#submit', 'click', 'onSubmitClick');
		this.bind('input', 'onKeyDown', 'onInputKeydown');
		this.bind('input', 'validate', 'onInputValidate');
	}


	onInputValidate(event) {
		const submit = this.view.queryComponent('#submit');
		const errors = this.view.queryComponent('#errors');
		event.detail.correct = false;
		errors.clear();
		errors.display = 'inherit';

		if (event.detail.userValidators.isValid(true)) {
			event.detail.correct = true;
		} else {
			event.detail.correct = false;

			if (!event.detail.userValidators.isValid(false)) {
				event.detail.erroneous = true;
			} else {
				event.detail.erroneous = false;
			}
		}

		let valid = true;

		this.view.queryComponentAll('input').forEach((input) => {
			if (!input.userValidators) {
				return;
			}

			if (!input.userValidators.isValid(false)) {
				valid = false;
			}

			const iterate = (name) => {
				errors.addStatusMessages(name, input.userValidators[`${name}s`]);
			};

			iterate('ok');
			iterate('warning');
			iterate('error');
		});

		if (errors.empty) {
			errors.display = 'none';
		}

		submit.enabled = valid;
	}


	onInputKeydown(event) {
		const input = event.detail;
		input.erroneous = false;
		input.correct = false;
	}


	onSubmitClick() {
		const login = this.view.queryComponent('#login');
		const email = this.view.queryComponent('#email');
		const password = this.view.queryComponent('#password');
		const passwordConfirm = this.view.queryComponent('#password-confirm');
		const submit = this.view.queryComponent('#submit');
		const errors = this.view.queryComponent('#errors');
		let valid = true;

		if (!submit.enabled) {
			return;
		}

		if (password.text !== passwordConfirm.text) {
			errors.addStatusMessage('error', 'Пароли не совпадают!');
			password.alert();
			passwordConfirm.alert();
			return;
		}

		this.view.queryComponentAll('input').forEach((input) => {
			if (!input.userValidators) {
				return;
			}

			if (!input.userValidators.isValid(false)) {
				input.alert();
				valid = false;
			}
		});

		if (!valid) {
			return;
		}

		submit.enabled = false;
		errors.text = 'Пожалуйста, подождите...';

		window.Network.userCreate({

			login: login.text,
			email: email.text,
			password: password.text

		}, (httpStatus, response) => {

			if (response.status === window.ErrorCodes.USER_ALREADY_EXISTS) {
				errors.text = null;
				errors.addStatusMessage('error',
					'Ошибка. Такой пользователь уже существует...');
			} else if (response.status === window.ErrorCodes.SUCCESS) {
				alert('Success!');
			} else {
				errors.text = null;
				errors.addStatusMessage('error',
					'Ошибка. Что-то пошло не так... Мы работаем над исправлением этого');
			}

			submit.enabled = true;
		});
	}


	onPasswordValidate() {
		//event.detail.valid;
	}


	onEnter() {
		// const scores = this.view.queryComponent('#scores');
		// const errors = this.view.queryComponent('#errors');
        //
		// errors.text = 'Для продолжения необходимо авторизоваться.';
	}

	onLeave() {
		// const email = this.view.queryComponent('#email');
		// const password = this.view.queryComponent('#password');
		// const errors = this.view.queryComponent('#errors');
        //
		// email.text = '';
		// email.erroneous = false;
        //
		// password.text = '';
		// password.erroneous = false;
	}

};
