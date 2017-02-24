'use strict';

const fs = require('fs');

const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/static'));

app.use((req, res, next) => {
	const content = fs.readFileSync('./static/error.html', 'utf-8');
	res.status(404).send(content);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
