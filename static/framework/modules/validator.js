'use strict';


window.Framework.Validator = class Validator {
	constructor(chain) {
		this.chain = chain;
	}

	validate(value) {
		/*
			state: 'ok', 'warning', 'error'
			value: any string or null
		*/

		this.chain.setInvalid('warning', `Value "${value}" may be invalid, unimplemented validator.`);
	}
};


window.Framework.NetworkValidator = class NetworkValidator extends window.Framework.Validator {
	constructor(chain) {
		super(chain);
		this.__networkMethod__ = null;
	}

	get networkMethod() {
		return this.__networkMethod__;
	}

	set networkMethod(value) {
		if (typeof value === 'string') {
			this.__networkMethod__ = window.Network[value];
			return;
		}

		this.__networkMethod__ = value;
	}

	validate(value) {
		this.networkMethod({ value: value }, (status, responses) => {
			responses.forEach((response) => {
				this.chain.setInvalid(response.status, response.msg);
			});
		});
	}
};


window.Framework.ValidatorChain = class ValidatorChain {
	constructor(validators) {
		this.__errors__ = [];
		this.__warnings__ = [];
		this.__oks__ = [];
		this.__validators__ = [];
		this.__firedCount__ = 0;
		this.onStateChange = null;

		validators.forEach((validator) => {
			if (typeof validator === 'string') {
				validator = window.Validator[validator];
			}

			if (validator) {
				this.__validators__.push(new validator(this));
			}
		});
	}

	get errors() {
		return this.__errors__;
	}

	get warnings() {
		return this.__warnings__;
	}

	get oks() {
		return this.__oks__;
	}

	clear() {
		this.__errors__ = [];
		this.__warnings__ = [];
		this.__oks__ = [];
		this.__firedCount__ = 0;
	}

	setInvalid(state, desc) {
		this.__firedCount__++;

		if (state == 'ok') {
			this.__oks__.push(desc);
		} else if (state == 'warning') {
			this.__warnings__.push(desc);
		} else {
			this.__errors__.push(desc);
		}

		if (this.__firedCount__ == this.__validators__.length && this.onStateChange) {
			this.onStateChange(this);
		}
	}

	isValid(strict) {
		if (this.__firedCount__ != this.__validators__.length) {
			return false;
		}

		if (strict) {
			return (this.__warnings__.length == 0) && (this.__errors__.length == 0);
		}

		return this.__errors__.length == 0;
	}

	validate(value) {
		this.clear();

		this.__validators__.forEach((validator) => {
			validator.validate(value);
		});
	}
};
