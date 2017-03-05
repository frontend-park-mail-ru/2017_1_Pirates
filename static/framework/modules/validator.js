'use strict';


window.Framework.Validator = class Validator {
	constructor() {
	}

	validate(value) {
		/*
			state: 'ok', 'warning', 'error'
			value: any string or null
		 */

		return {state: 'warning', desc: `Value "${value}" may be invalid, unimplemented validator.`}
	}
};


window.Framework.NetworkValidator = class NetworkValidator extends Validator {
	constructor() {
		super();
	}
};


window.Framework.ValidatorChain = class ValidatorChain {
	constructor(validators) {
		this.__errors__ = [];
		this.__warnings__ = [];
		this.__oks__ = [];
		this.__validators__ = [];

		if (typeof validators === 'string') {
			validators = validators.replace(' ', '').split(',');
		}

		validators.forEach((validator) => {
			if (typeof validator === 'string') {
				validator = window.Validator[validator];
			}

			this.__validators__.push(new validator());
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
	}

	setInvalid(type, desc) {
		if (type === 'warning') {
			this.__warnings__.push(desc);
			return;
		}

		this.__errors__.push(desc);
	}

	isValid(strict) {
		if (strict || true) {
			return (this.__warnings__.length == 0) && (this.__errors__.length == 0);
		}

		return this.__errors__.length == 0;
	}

	validate(value) {
		this.clear();

		this.__validators__.forEach((validator) => {
			const result = validator.validate(value);

			switch (result.state) {
				case 'ok': {
					this.__oks__.push(result.desc);
				} break;

				case 'warning': {
					this.__warnings__.push(result.desc);
				} break;

				case 'error': {
					this.__errors__.push(result.desc);
				} break;

				default: break;
			}
		});

		return this.isValid(true);
	}
};
