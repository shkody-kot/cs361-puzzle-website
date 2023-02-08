//Server-side shenanigans
//Required packages
const express = require("express");
var path = require('path');
var fs = require('fs');
var hbs = require('express-handlebars')

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

/*app.get('/memory', function (request, response) {
	
});

app.get('/score', function (request, response) {
	
});*/

app.get('*', function (request, response) {
	response.status(404).render('404', { layout: 'main' });
})


app.listen(port, function () {
	console.log("Server is listening on port", port);
});