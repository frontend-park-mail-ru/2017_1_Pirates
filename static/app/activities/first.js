'use strict';


window.Activity.FirstActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	};

	onEnter(args) {
		this.view.queryComponentAll('button.my-button').forEach((button) => {
			button.text = 'kek';
		});

		this.view.queryComponent('#Button2').text = 'lol';
	};

	sayHi(args) {
		alert(`Hello, Mr. ${args.name} of age ${args.age}!`);
	};

};
