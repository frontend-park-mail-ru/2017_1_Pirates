'use strict';


window.Animation.Opacity = class extends window.Framework.Animation {
	constructor(activity, duration) {
		super(activity);

		// duration попадает сюда из аттрибута enterDuration или leaveDuration тэга app-activity
		this.duration = duration || 3000;
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
		this.view.style.transition = `opacity ${this.duration}ms ease`;
		this.view.style.opacity = end;

		/*
		 В конце анимации обязательно надо вызвать this.end()
		 В конце -- это именно что значит, когда анимация отработает,
		 поэтому мы тут и вешаем обработчик на transitionend

		 Мы хотим послушать его всего лишь один раз, поэтому удалим listener за собой
		 */

		const that = this;

		function listener() {
			that.end();
			that.view.removeEventListener('transitionend', listener);
		}

		this.view.addEventListener('transitionend', listener);
	}

	// Убрать анимацию (когда отработала)
	remove() {
		this.view.style.transition = 'none';
	}
};
