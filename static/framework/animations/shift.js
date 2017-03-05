'use strict';


window.Animation.Shift = class extends window.Framework.Animation {
	constructor(activity, duration) {
		super(activity);

		// duration попадает сюда из аттрибута enterDuration или leaveDuration тэга app-activity
		this.duration = duration || 0.4;
	}

	// Применить анимацию (и запустить её)
	apply(reverse) {
		/*
		 reverse будет true, когда анимацию надо проиграть "назад", т.е. она была вызвана не
		 при появлении вьюхи, а при исчезновении.
		 */

		let start = '-10%';
		let end = '0px';
		let opacityStart = 0;
		let opacityEnd = 1;
		let offset = 0.7;
		let timingFunction = 'ease-out';

		if (reverse) {
			start = '0%';
			end = '10%';
			opacityStart = 1;
			opacityEnd = 0;
			offset = 0.2;
			timingFunction = 'ease-in';
		}

		// CSS3 анимация

		let rows = [...this.view.querySelectorAll('view-row')];
		let step = 0.1;
		let cur = 0.02;
		let lastRow = null;

		rows.forEach(row => {
			row.style.left = start;
			row.style.opacity = opacityStart;
			cur += step;

			row.style.transition = `
				left ${this.duration}s ${timingFunction} ${cur}s,
				opacity ${this.duration * 0.7}s ease ${cur}s
			`;
			lastRow = row;
		});

		window.setTimeout(() => {
			rows.forEach(row => {
				row.style.left = end;
				row.style.opacity = opacityEnd;
			});
		}, 20);

		// let animate = row => {
		// 	return new Promise((resolve, reject) => {
		// 		setTimeout(()=>{
		// 			row.style.left = end;
		// 			resolve();
		// 		},200)
		// 	});
        //
		// };
        //
		// let rows = [...document.querySelectorAll('view-row')];
		// rows.forEach(row => {
		// 	row.style.left = start;
		// 	row.style.transition = `left ${this.duration}s ${timeFunction}`;
		// });
        //
		// let p = Promise.resolve();
		// rows.forEach(row => {
		// 	console.log(row);
		// 	p = p.then( () => { return animate(row); } );
		// });

		lastRow.addEventListener('transitionend', () => {
			window.setTimeout(() => {
				this.end();
			}, 100);
		}, {once: true});

		/*window.setTimeout(() => {
			this.end();
		}, 1000);*/

		// this.view.style.opacity = 1;

		/*
		 В конце анимации обязательно надо вызвать this.end()
		 В конце -- это именно что значит, когда анимация отработает,
		 поэтому мы тут и вешаем обработчик на transitionend

		 Мы хотим послушать его всего лишь один раз, поэтому удалим listener за собой
		 */
	}

	// Убрать анимацию (когда отработала)
	remove() {
		let rows = [...this.view.querySelectorAll('view-row')];

		rows.forEach(row => {
			row.style.transition = 'none';
		});
		//this.view.style.transition = 'none';
	}
};
