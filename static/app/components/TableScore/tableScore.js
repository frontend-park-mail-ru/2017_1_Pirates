'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.TableScore = class extends window.Framework.ComponentStub.TableScore {

		constructor() {
			super();
		}


		onListChange(data) {
			if (typeof data !== 'object') {
				return data;
			}

			const table = this.view.querySelector('.table');

			data.forEach((record) => {
				let row = document.createElement('view-row');
				row.setAttribute('width', '4');

				let col = document.createElement('view-column');
				col.style.display = 'none';
				row.appendChild(col);

				col = document.createElement('view-column');
				col.setAttribute('width', '2');
				col.textContent = record.user;
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
	}

});
