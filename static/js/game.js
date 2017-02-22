"use strict";

let x = new Date().getTime() + 11000;
function backTimer() {
	let game = document.getElementById('game');
	let i = new Date().getTime();
	if (i < x) {
		const time = new Date(x - i);
		game.textContent = time.getMinutes() + " : " + time.getSeconds();
		setTimeout(backTimer, 1000);
	} else {
		if (Math.random() > 0.5) {
			game.textContent = "You win!"
		} else {
			game.textContent = "You lose :("
		}
	}
}
backTimer();
