'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.TableScore = class extends window.Framework.ComponentStub.TableScore {

		constructor() {
			super();
		}


		clear() {
			const table = this.view.querySelector('.table');
			[...table.querySelectorAll('.content-row')].forEach((row) => {
				row.outerHTML = '';
			});
		}


		onListChange(data) {
			if (typeof data !== 'object') {
				return data;
			}

			const table = this.view.querySelector('.table');
			this.clear();

			data.forEach((record) => {
				let row = document.createElement('view-row');
				row.setAttribute('width', '4');
				row.setAttribute('class', 'content-row');

				let col = document.createElement('view-column');
				col.style.display = 'none';
				row.appendChild(col);

				col = document.createElement('view-column');
				col.setAttribute('width', '2');
				col.textContent = record.login;
				row.appendChild(col);

				col = document.createElement('view-column');
				col.setAttribute('width', '2');
				col.textContent = record.score;
				row.appendChild(col);

				col = document.createElement('view-column');
				col.style.display = 'none';
				row.appendChild(col);

				table.appendChild(row);
			});

			return data;
		}
	};

});
