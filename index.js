const express = require("express");
const app = express();
const test = 'asd';
const fortune = require('./lib/fortune.js');

const handlebars = require('express-handlebars')
	.create({ defaultLayout:'main', extname: '.hbs' });

app.set('port', process.env.PORT || 3000);
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');

const fortunes = [
	"Победи свои страхи, или они победят тебя.",
	"Рекам нужны истоки.",
	"Не бойся неведомого.",
	"Тебя ждет приятный сюрприз.",
	"Будь проще везде, где только можно.",
];

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/headers', function(req,res) {
	res.set('Content-Type','text/plain');
	let s = '';
	for(let name in req.headers) {
		s += name + ': ' + req.headers[name] + '\n';
	}
	res.json({"name": "dima"});
	// res.send(s);
});

app.get('/about', (req, res) => {
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/test-about.js'
	});
});

app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});
app.get('/tours/oregon-coast', function(req, res){
	res.render('tours/oregon-coast');
});

// пользовательская страница 404
app.use( (req, res) => {
	res.type('text/html');
	res.status(404);
	res.render('404');
});

// пользовательская страница 500
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.type('text/html');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log( 'Express запущен на http://localhost:' +
	app.get('port') + '; нажмите Ctrl+C для завершения.' );
});