'use strict';

const fs = require('fs');


module.exports.error = (response, code, name, arg) => {
	let content = fs.readFileSync(`./static/error.html`, 'utf-8');
	content = content.replace('%TITLE%', `${code} ${name}`);
	content = content.replace('%ARG%', arg);

	response.writeHead(code, {'Content-Type': 'text/html'});
	response.write(content);
	response.end();

	console.error(`${code} ${name} - ${arg}`);
};


module.exports.contentType = (url) => {
	if (/\.js/i.test(url)) return 'application/javascript';
	if (/\.css/i.test(url)) return 'text/css';
	if (/\.html/i.test(url) || /\.htm/i.test(url)) return 'text/html';
	if (/\.jpeg/i.test(url) || /\.jpg/i.test(url)) return 'image/jpeg';
	if (/\.gif/i.test(url)) return 'image/gif';
	if (/\.png/i.test(url)) return 'image/png';
	if (/\.svg/i.test(url)) return 'image/svg+xml';
	if (/\.webm/i.test(url)) return 'audio/webm';
	if (/\.ogg/i.test(url)) return 'audio/ogg';
	return 'text/plain';
};


module.exports.serve = (request, response) => {
	let rawParts = request.url.split('/').splice(1);
	let parts = [];

	rawParts.forEach((part) => {
		if ('..' == part) {
			if (parts.length > 0) {
				parts.pop();
			}
		} else {
			parts.push(part);
		}
	});

	let url = parts.join('/');
	let mime = module.exports.contentType(url);
	let content;

	try {
		if (/text\/*/.test(mime)) {
			content = fs.readFileSync('./' + url, 'utf-8');
		} else {
			content = fs.readFileSync('./' + url);
		}
	} catch (err) {
		module.exports.error(response, 404, 'Not Found', url);
		return;
	}

	response.writeHead(200, {'Content-Type': mime});
	response.write(content);
	response.end();
};
