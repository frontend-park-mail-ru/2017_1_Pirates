'use strict';


window.Activity.FirstActivity = class extends window.Framework.Activity {

	constructor() {
		super();
		this.setupBackground();
	}


	setupBackground() {
		const background = document.querySelector('div#background');
		const colors = [
			'black', '#7f3357', '#3e1228', '#174466', '#251e3f', '#022837' /*'#4f5840' '#7a6b4b'*/
		];
		let last = 'black';

		const fire = () => {
			let color = last;

			while (color === last) {
				color = colors[Math.floor(Math.random() * colors.length)];
			}

			background.style.backgroundColor = color;
		};

		if (!window.Framework.debugAnimation) {
			window.setInterval(() => {
				fire();
			}, 3 * 1000 + 10);
		}

		fire();
	}


	onEnter() {
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
	}

	sayHi(args) {
		alert(`Hello, Mr. ${args.name} of age ${args.age}!`);
	}

};
