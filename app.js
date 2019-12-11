const http = require('http');
const fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
	if(!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function(err,data) {
		if(err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('500 - Internal Error');
			console.log(err);
		} else {
			res.writeHead(responseCode, { 'Content-Type': contentType });
			res.end(data);
		}
	});
}



http.createServer((req, res) => {
	// res.end('Hello World!');
	var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
	switch(path) {
		case '':
			res.writeHead(200, {'Content-Toe': 'text/plain'});
			serveStaticFile(res, '/static/home.html', 'text/html');
			break;
		case '/about':
			serveStaticFile(res, '/static/about.html', 'text/html');
			res.end('About US');
			break;
		case '/img/logo.jpg':
			serveStaticFile(res, '/static/img/logo.jpg', 'image/jpeg');
			break;
		default:
			res.writeHead(404, {'Content-Toe': 'text/plain'});
			serveStaticFile(res, '/static/404.html', 'text/html', 404);
			break;
	}
}).listen(3000);