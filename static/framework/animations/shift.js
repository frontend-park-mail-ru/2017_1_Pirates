'use strict';


window.Animation.Shift = class extends window.Framework.Animation {
	constructor(activity, duration) {
		super(activity);

		// duration попадает сюда из аттрибута enterDuration или leaveDuration тэга app-activity
		this.duration = duration || 2;
	}

	// Применить анимацию (и запустить её)
	apply(reverse) {
		/*
		 reverse будет true, когда анимацию надо проиграть "назад", т.е. она была вызвана не
		 при появлении вьюхи, а при исчезновении.
		 */

		let start;
		let end;
		let timeFunction;
		if (reverse) {
			start = '0%';
			end = '-100%';
			timeFunction = 'ease-in'
		} else {
			start = '-100%';
			end = '0%';
			timeFunction = 'ease-out';
		}

		// CSS3 анимация
		// const rows = document.querySelectorAll('view-row');

		let rows = [...this.view.querySelectorAll('view-row')];

		let step = this.duration / rows.length;
		console.log(step);
		let cur = 0.02;


		rows.forEach(row => {
			row.style.left = start;
			cur += step;
			row.style.transition = `left ${this.duration}s ${timeFunction} ${cur}s`;
			row.style.left = end;
		});

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
		// 	row.style.transition = `left 2s ease`;
		// });
        //
		// let p = Promise.resolve();
		// rows.forEach(row => {
		// 	console.log(row);
		// 	p = p.then( () => { return animate(row); } );
		// });

		this.view.addEventListener('transitionend', () => {
			this.end();
		}, {once: true});

		this.view.style.opacity = 1;

		/*
		 В конце анимации обязательно надо вызвать this.end()
		 В конце -- это именно что значит, когда анимация отработает,
		 поэтому мы тут и вешаем обработчик на transitionend

		 Мы хотим послушать его всего лишь один раз, поэтому удалим listener за собой
		 */
	}

	// Убрать анимацию (когда отработала)
	remove() {
		this.view.style.transition = 'none';
	}
};
