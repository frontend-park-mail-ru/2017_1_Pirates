'use strict';


window.addEventListener('CreateComponents', () => {
	window.Component.Loading = class extends window.Framework.ComponentStub.Loading {

		constructor() {
			super();

			window.setTimeout(() => {
				this.setup();
			}, 100);

			window.setInterval(() => {
				if (!this.visible) {
					this.view.style.display = 'none';
				}
			}, 1000);
		}


		setup() {
			const load = this.view.querySelector('div');

			const radius = 14;
			const circlesNumber = 8;
			const wrap = 64 - 4;

			for (let i = 0; i < circlesNumber; i++) {
				const circle = document.createElement('span');
				const f = 2 / circlesNumber * i * Math.PI;

				circle.setAttribute('class', 'circle flicker');
				circle.style.left = (Math.cos(f) * radius + wrap / 2) + 'px';
				circle.style.top = (Math.sin(f) * radius + wrap / 2) + 'px';

				load.appendChild(circle);
			}
		}


		onSetVisible(visible) {
			if (visible) {
				this.view.style.display = 'block';

				window.setTimeout(() => {
					this.view.querySelector('div').style.opacity = 1;
				}, 100);
			} else {
				this.view.querySelector('div').style.opacity = 0;
			}

			return visible;
		}

	};
});
