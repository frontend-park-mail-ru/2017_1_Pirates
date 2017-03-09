'use strict';


window.ErrorCodes = new class {
	constructor() {
	}

	/*
	 public static final int SUCCESS = -1;
	 public static final int JSON_ERROR = 600;
	 public static final int USER_ALREADY_EXISTS = 601;
	 public static final int USER_NOT_FOUND = 602;
	 public static final int BAD_LOGIN_OR_PASSWORD = 603;
	 public static final int SESSION_INVALID = 604;
	 public static final int BAD_VALIDATOR = 605;
	 */

	get SUCCESS() 				{ return  -1; }
	get JSON_ERROR() 			{ return 600; }
	get USER_ALREADY_EXISTS()   { return 601; }
	get USER_NOT_FOUND()        { return 602; }
	get BAD_LOGIN_OR_PASSWORD() { return 603; }
	get SESSION_INVALID()       { return 604; }
	get BAD_VALIDATOR()         { return 605; }

};
