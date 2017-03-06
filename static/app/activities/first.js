'use strict';


window.Activity.FirstActivity = class extends window.Framework.Activity {

	constructor() {
		super();
		this.setupBackground();
		//this.setupStains();
	};


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

		window.setInterval(() => {
			fire();
		}, 3 * 1000 + 10);

		fire();
	}


	setupStains() {
		const background = document.querySelector('div#background');
		let count = 0;

		window.setInterval(() => {
			if (count > 5) return;

			const stain = document.createElement('div');
			count++;

			stain.className = 'stain';
			stain.style.left = Math.floor(background.width / 2);
			stain.style.top = Math.floor(background.height / 2);
			stain.style.transition = `
				transition: left 5s linear,
				top 5s linear,
				height 5s linear,
				width 5s linear
			`;

			background.appendChild(stain);

			window.setTimeout(() => {
				stain.left = 0;
				stain.top = 0;
				stain.height = background.height;
				stain.width = background.width;
			}, 20);
		}, 1000);
	}


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
