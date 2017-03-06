'use strict';


window.Activity.FirstActivity = class extends window.Framework.Activity {

	constructor() {
		super();
	};

	onEnter(args) {
		this.view.queryComponentAll('test-button.my-button').forEach((button) => {
			button.text = 'kek';
		});

		this.view.queryComponent('#Button2').text = 'lol';
		this.view.queryComponent('#Button1').color = 'rgb(0,0,255)';

		const edit = this.view.queryComponent('test-edit-box');
		//edit.text = 'lol kek cheburek';
		const data = edit.data;

		data.text = 'bob12';
		data.children.btn.text = 'It Works!';

		edit.data = data;
	};

	sayHi(args) {
		alert(`Hello, Mr. ${args.name} of age ${args.age}!`);
	};

};
