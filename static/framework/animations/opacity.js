'use strict';


window.Animation.Opacity = class extends window.Framework.Animation {
	constructor(activity, duration) {
		super(activity);

		// duration попадает сюда из аттрибута enterDuration или leaveDuration тэга app-activity
		this.duration = duration || 1;
	}

	// Применить анимацию (и запустить её)
	apply(reverse) {
		/*
		 reverse будет true, когда анимацию надо проиграть "назад", т.е. она была вызвана не
		 при появлении вьюхи, а при исчезновении.
		 */

		let start = 0;
		let end = 1;

		if (reverse) {
			start = 1;
			end = 0;
		}

		// CSS3 анимация
		this.view.style.opacity = start;
		this.view.style.transition = `opacity ${this.duration}s ease`;
		//alert(this.duration);

		//this.view.addEventListener('transitionend', () => {
		//	this.end();
		//}, {once: true});

		window.setTimeout(() => {
			this.end();
		}, 20 + this.duration * 1000);

		window.setTimeout(() => {
			this.view.style.opacity = end;
		}, 20);

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
		this.view.style.opacity = 1;
		console.log((new Date()).toTimeString(), 'animation removed');
	}
};
