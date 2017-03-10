'use strict';


window.addEventListener('CreateComponents', () => {

	window.Component.TableScore = class extends window.Framework.ComponentStub.TableScore {

		constructor() {
			super();
		}


		onDataChange(data) {

			const fakeData = {'lol':1488, 'kek':1941, 'cheburek':11};

			const table = this.view.querySelector('.table');

			Object.keys(fakeData).forEach(user => {
				let row = document.createElement('view-row');
				row.setAttribute('width', '4');
				row.appendChild(document.createElement('view-column'));

				let col = document.createElement('view-column');
				col.setAttribute('width', '1');
				col.textContent = user;
				row.appendChild(col);

				col = document.createElement('view-column');
				col.setAttribute('width', '1');
				col.textContent = fakeData[user];
				row.appendChild(col);

				row.appendChild(document.createElement('view-column'));

				table.appendChild(row);
			});

			return data;
		}
	}

});
