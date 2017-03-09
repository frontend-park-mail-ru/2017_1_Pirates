'use strict';


window.Validator.RemotePassword = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validatePassword;
	}
};


/*window.Validator.NoNumbers = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validateNoNumbers;
	}
};


window.Validator.IsBob = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validateIsBob;
	}
};*/
