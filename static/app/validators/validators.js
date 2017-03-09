'use strict';


window.Validator.RemotePassword = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validatePassword;
	}
};


window.Validator.RemoteLogin = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validateLogin;
	}
};


window.Validator.RemoteEmail = class extends window.Framework.NetworkValidator {
	constructor(chain) {
		super(chain);
		this.networkMethod = window.Network.validateEmail;
	}
};


window.Validator.Empty = class extends window.Framework.Validator {
	constructor(chain) {
		super(chain);
	}

	validate() {
		this.chain.setFired();
	}
};


