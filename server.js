//Server-side shenanigans
//Required packages
const express = require("express");
var path = require('path');
var fs = require('fs');
var hbs = require('express-handlebars')
//json files for score and memory
var scores = require(__dirname + '/scores.json')
var memory_cards = require(__dirname + '/memory_cards.json')

//create application
var app = express();

//includes all the funky little css and js files
app.use(express.static(__dirname + '/public'));
app.use(express.json());

var port = process.env.PORT || 3000;

//set server to use handlebars templates
app.set('view engine', 'handlebars');

app.engine('handlebars', hbs.engine({
	layoutsDir: path.join(__dirname, '/views/layouts'),
	extname: 'handlebars',
	defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials')
}));

//POST request to add data to scoreboard
app.post('/add', function(request, response, next){
	console.log('post request received');
	console.log(request.body);
	if (request.body && request.body.game && request.body.name && request.body.time)
	{
		scores.push({
			"game": request.body.game,
			"name": request.body.name,
			"time": request.body.time
		});
		fs.writeFile(
			"./scores.json",
			JSON.stringify(scores, null, 2),
			function(error) {
				if (!error) { response.status(200).send(); }
				else { response.status(500).send("Error storing file"); }
			}
		);
	}
	else { response.status(400).send("Your request sucks"); }
});

//Server's GET requests for pages
app.get('/', function (request, response) {
	response.status(200).render('intro', { layout: 'main' });
});

//keep track of difficulty setting
var easy_setting = true;

app.get('/slide', function (request, response) {
	response.status(200).render('slide', { layout: 'main', button: false, easy: easy_setting });
})

app.get('/slide/easy', function (request, response) {
	easy_setting = true;
	response.status(200).render('slide', { layout: 'main', button: false, easy: true });
});

app.get('/slide/hard', function (request, response) {
	easy_setting = false;
	response.status(200).render('slide', { layout: 'main', button: false, easy: false });
});

app.get('/slide/:num', function (request, response) {
	var number = request.params.num;
	if (number < 0 || number > 3) { next(); }
	response.status(200).render('slide', { layout: 'main', button: true, easy: easy_setting });
});

app.get('/sudoku', function (request, response) {
	response.status(200).render('sudoku', { layout: 'main' });
});

app.get('/memory', function (request, response) {
	response.status(200).render('memory', { layout: 'main', card: memory_cards });
});

app.get('/score', function (request, response) {
	response.status(200).render('score', { layout: 'main', entry: scores });
});

app.get('*', function (request, response) {
	response.status(404).render('404', { layout: 'main' });
})


app.listen(port, function () {
	console.log("Server is listening on port", port);
});