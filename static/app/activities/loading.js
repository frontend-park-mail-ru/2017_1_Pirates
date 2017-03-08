'use strict';


window.Activity.LoadingActivity = class extends window.Framework.Activity {

	constructor() {
		super();
		this.setupBackground();

		this.bind('button', 'click', 'onButtonClick');
	};


	onButtonClick(event) {
		alert('binded!');
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


	onEnter(args) {
	};

};
