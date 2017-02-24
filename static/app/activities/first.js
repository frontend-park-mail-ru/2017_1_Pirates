'use strict';


window.Activity.FirstActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	};

	onEnter(args) {
		alert('It works!');
	};

	sayHi(args) {
		alert(`Hello, Mr. ${args.name} of age ${args.age}!`);
	};

};
