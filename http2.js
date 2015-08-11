var http2 = require('http2'),
		fs = require('fs');

var options = {
	key: fs.readFileSync(__dirname + '/cert/server.key'),
	cert: fs.readFileSync(__dirname + '/cert/server.crt'),
};

http2.createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);