'use strict';

const http = require('http');
const fs = require('fs');


const server = http.createServer((request, response) => {
	const url = request.url;
	console.log(`${request.method} ${url}`);

	let content = fs.readFileSync('./static/hello.html', 'utf-8');

	response.writeHead(200, {"Content-Type": "text/html"});

	response.write(content);
	response.end();
	console.log('Request complete.');
});


const port = process.env.PORT || 3000;

server.listen(port, (error) => {
	if (!error) {
		console.log(`Server started! Port ${port}`);
		return;
	}

	console.log(`Error! ${error}`);
});
