'use strict';


window.Activity.LoginActivity = class extends window.Framework.Activity {

	constructor() {
		super();

		//this.bind('#password', 'validate', 'onPasswordValidate');
		this.bind('#submit', 'click', 'onSubmitClick');
	};


	onSubmitClick(event) {
		//const submit = this.view.q
	}


	onPasswordValidate(event) {
		//event.detail.valid;
	}


	onEnter(args) {
		const scores = this.view.queryComponent('#scores');
		scores.visible = false;
	};

};
