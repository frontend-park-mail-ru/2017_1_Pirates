'use strict';

const http = require('http');
const fs = require('fs');

const worker = function (request, response) {

	const url = request.url;
	console.log(`${request.method} ${url}`);

	let content = fs.readFileSync('./static/hello.html', 'utf-8');

	response.writeHead(200, {"Content-Type": "text/html"});

	response.write(content);
	response.end();
	console.log('complete')

};

const server = http.createServer(worker);

const port = process.env.PORT || 3000;
console.log(`Server start! Port ${port}`);

server.listen(port);
