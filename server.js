var express = require('express'),
	app = express(),
	http = require('http'),
	fs = require('fs'),
	port = process.env.PORT || 3000;

app.use('/lib', express.static(__dirname + '/lib'));
app.get('/sw.bundle.js', function(req, res){
	res.set('Content-Type', 'application/javascript');
	res.end(fs.readFileSync('sw.bundle.js'));
});
app.get('/*', function(req, res) {
	res.end(fs.readFileSync('index.html'));
});

http.createServer(app).listen(port, function(err) {
	console.log('Express server running on port', port);
});
