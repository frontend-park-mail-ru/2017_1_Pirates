'use strict';

const fs = require('fs');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	const content = fs.readFileSync('./static/index.html', 'utf-8');
	res.send(content);
});

app.use(express.static('static'));

app.listen(process.env.port || 3000, () => {
	console.log('Example app listening on port 3000!');
});

app.use((req, res, next) => {
	const content = fs.readFileSync('./static/error.html', 'utf-8');
	res.status(404).send(content);
});
