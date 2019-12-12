const express = require("express");
const app = express();
const fortune = require('./lib/fortune.js');
const formidable = require('formidable' );
const jqupload = require('jquery-file-upload-middleware' );

const handlebars = require('express-handlebars')
	.create({
		defaultLayout:'main',
		extname: '.hbs',
		helpers: {
			section: function(name, options){
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});

app.set('port', process.env.PORT || 3000);
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');

app.use(require('body-parser'). urlencoded({ extended: true }));

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

app.use('/upload', function(req, res, next){
	const now = Date.now();
	jqupload.fileHandler({
		uploadDir: function(){
			return __dirname + '/public/uploads/' + now;
		},
		uploadUrl: function(){
			return '/uploads/' + now;
		},
	})(req, res, next);
});

app.get('/contest/vacation-photo', function(req, res){
	const now = new Date();
	res.render('contest/vacation-photo', {
		year: now.getFullYear(),
		month: now. getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month' , function(req, res){
	const form = new formidable. IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error' );
		console.log('received fields:' );
		console.log(fields);
		console.log('received files:' );
		console.log(files);
		res.redirect(303, '/thank-you' );
	});
});

app.get('/newsletter', function(req, res){
	// мы изучим CSRF позже... сейчас мы лишь
	// заполняем фиктивное значение
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function(req, res){
	if(req.xhr || req.accepts('json,html' )==='json' ){
// если здесь есть ошибка, то мы должны отправить { error: 'описание ошибки' }
		res.send({ success: true });
	} else {
		// если бы была ошибка, нам нужно было бы перенаправлять на страницу ошибки
		res.redirect(303, '/thank-you' );
	}
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