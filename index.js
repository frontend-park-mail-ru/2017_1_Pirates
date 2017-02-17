'use strict';

const http = require('http');
const fs = require('fs');
const staticServer = require('./server/static');


const server = http.createServer((request, response) => {
	console.log(`${request.method} ${request.url}`);

	if (request.url == '/') {

		let content = fs.readFileSync('./static/index.html', 'utf-8');
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(content);
		response.end();
		return;

	}

	if (request.url.startsWith('/static/')) {

		return staticServer.serve(request, response);

	}

	return staticServer.error(response, 404, 'Not Found', request.url);
});


const port = process.env.PORT || 3000;

server.listen(port, (error) => {
	if (!error) {
		console.log(`Server started! Port ${port}`);
		return;
	}

	console.error(`Error! ${error}`);
});
