const express = require("express");
const app = express();

var fortune = require('./lib/fortune.js');

var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main', extname: '.hbs' });

app.set('port', process.env.PORT || 3000);
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


var fortunes = [
	"Победи свои страхи, или они победят тебя.",
	"Рекам нужны истоки.",
	"Не бойся неведомого.",
	"Тебя ждет приятный сюрприз.",
	"Будь проще везде, где только можно.",
];

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	res.render('about', {
		fortune: fortune.getFortune()
	});
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