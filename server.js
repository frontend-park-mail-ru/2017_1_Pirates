'use strict';

const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');

const app = express();
const swaggerDocument = require('./static/app/swagger.json');

app.use('/', express.static(__dirname + '/static'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  // Swagger


/*
	Test API implementation Start
*/

app.use('/validators/noNumbers', bodyParser.json(), (req, res) => {
	if (((req.body.value || '').match(/\d/) || []).length == 0) {
		res.send(JSON.stringify(
			[
				{
					status: 'warning',
					desc: 'Your name has no numbers, that\'s really bad.'
				}
			]
		));

		return;
	}

	res.send(JSON.stringify(
		[
			{
				status: 'ok',
				desc: 'Allright, your name has some numbers in it.'
			}
		]
	));
});


app.use('/validators/isBob', bodyParser.json(), (req, res) => {
	if ((req.body.value || '').toLowerCase().startsWith('bob')) {
		res.send(JSON.stringify([{status: 'ok'}]));
		return;
	}

	res.send(JSON.stringify(
		[
			{
				status: 'error',
				desc: 'Get lost! Only Bob allowed.'
			}
		]
	));
});


/*
	Test API implementation End
*/



app.use((req, res, next) => {
	const content = fs.readFileSync('./static/error.html', 'utf-8');
	res.status(404).send(content);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
