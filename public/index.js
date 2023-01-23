var url = window.location.pathname.split('/');

//global timer variables
var counting;
var disable_timer, enable_timer;

//global sudoku variables
var sudoku_array = [];
var notes;
/****************************************************
TIMER
*****************************************************/
function set_timer(started)
{
	//Timer code adapted from w3schools' countdown code at: https://www.w3schools.com/howto/howto_js_countdown.asp
	//accessed jan. 24, 2023
	console.log("welcome to timer land");
	if (!started)
	{
		//get start time
		var start = new Date().getTime();
		
		counting = setInterval(function(){
			var now = new Date().getTime();
			var distance = now - start;
			
			//calculations for minutes and seconds
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			
			//display to html
			if (seconds < 10) { document.getElementById("timer").textContent = minutes + ':0' + seconds; }
			else { document.getElementById("timer").textContent = minutes + ':' + seconds; }
		});
	}
	else { console.log("stopping"); clearInterval(counting); }
}

if (url[1] == "slide" || url[1] == "sudoku")
{
	disable_timer = document.getElementById('disable');
	enable_timer = document.getElementById('enable');
	
	//enable even listeners for turning on/off the timer
	disable_timer.addEventListener("click", function() {
		set_timer(true);
		disable_timer.classList.add('hide');
		enable_timer.classList.remove('hide')
	});
	
	enable_timer.addEventListener("click", function() {
		set_timer(false);
		disable_timer.classList.remove('hide');
		enable_timer.classList.add('hide')
	});
}

/****************************************************
SLIDE PUZZLE
*****************************************************/
function click_tile(row, col, max) {
	var cell = document.getElementById("cell" + row + col);
	console.log(row + " " + col);
	var tile = cell.className;
	
	if (tile != "tile9" && tile != "tile16") //if not empty tile
	{
		if (col < max) //if empty tile to the right
		{
			if (document.getElementById("cell" + row + (col + 1)).className === "tile9" ||
				document.getElementById("cell" + row + (col + 1)).className === "tile16") {
				swap("cell" + row + col, "cell" + row + (col + 1));
				return checkWin();
			}
		}

		if (col > 1) //if empty tile to the left
		{
			if (document.getElementById("cell" + row + (col - 1)).className === "tile9" || 
				document.getElementById("cell" + row + (col - 1)).className === "tile16") {
				swap("cell" + row + col, "cell" + row + (col - 1));
				validClick = true;
				return checkWin();
			}
		}

		if (row > 1) //if empty tile above
		{
			if (document.getElementById("cell" + (row - 1) + col).className === "tile9" ||
				document.getElementById("cell" + (row - 1) + col).className === "tile16") {
				swap("cell" + row + col, "cell" + (row - 1) + col);
				return checkWin();
			}
		}

		if (row < max) //if empty tile below
		{
			if (document.getElementById("cell" + (row + 1) + col).className === "tile9" ||
				document.getElementById("cell" + (row + 1) + col).className === "tile16") {
				swap("cell" + row + col, "cell" + (row + 1) + col);
				return checkWin();
			}
		}
	}
	return false;
}

function solvable() {
	var inversions = getInversions();
	if (inversions % 2 === 0)
		return true;
	return false;
}

function checkWin() {
	var inversions = getInversions();
	var last_cell;
	if (document.getElementById('cell33').className === "tile9") { last_cell = document.getElementById('cell33');}
	else { last_cell = document.getElementById('cell44'); }
	
	if (inversions == 0 && (last_cell.className == 'tile9' || last_cell.className == 'tile16'))
	{
		set_timer(true);
		return true;
	}
	return false;
}

function getInversions() {
	var tiles = document.getElementsByClassName('tiles');
	var order = [];
	for (let i = 0; i < tiles.length; i++) {
		var square = tiles[i].classList[0];
		var num = square[4];
		order.push(num);
	}
	console.log("Order: ", order);
	var inversions = 0;
	for (let i = 0; i < order.length; i++) {
		for (let x = i + 1; x < order.length; x++) {
			if (order[i] > order[x])
				inversions = inversions + 1;
		}
	}
	return inversions;
}

function swap(cell1, cell2) {
	//console.log("swapping " + cell1 + " and " + cell2);
	var temp = document.getElementById(cell1).className;
	//console.log(temp);
	document.getElementById(cell1).className = document.getElementById(cell2).className;
	document.getElementById(cell2).className = temp;
}

function shuffle() {
	var max_value;
	if (document.getElementById('cell33').className === "tile9") { max_value = 3;}
	else { max_value = 4; }
	do {
		for (var row = 1; row <= max_value; row++) {
			for (var col = 1; col <= max_value; col++) {
				var row2 = Math.floor(Math.random() * max_value + 1); //Pick a random row from 1 to max
				var col2 = Math.floor(Math.random() * max_value + 1); //Pick a random column from 1 to max
				
				swap("cell" + row + col, "cell" + row2 + col2); //Swap the look & feel of both cells
			}
		}
		var solve = solvable();
	} while (solve === false);
}

function display_solved(whichImg) {
	var missingPiece;
	if (document.getElementById('cell33').className === "tile9") { missingPiece = document.getElementById('cell33');}
	else { missingPiece = document.getElementById('cell44'); }
	
	var classToAdd = 'solved' + whichImg;
	missingPiece.classList.add(classToAdd);
	var gameMessage = document.getElementById('game-play-message');
	gameMessage.classList.add('hide');
	var winMessage = document.getElementById('solved-message');
	winMessage.classList.remove('hide');
	
	var newgame = document.getElementById('newgame');
	newgame.classList.add('hide');
	document.getElementById('back-button').classList.add('hide');
	document.getElementById('enable').classList.add('hide');
	document.getElementById('disable').classList.add('hide');
	var play_again = document.getElementById('solved-play-again');
	play_again.classList.remove('hide');
	document.getElementById('puzzle-solved-buttons').classList.remove('hide');
	document.getElementById('add-score').classList.remove('hide');
	
	var table = document.getElementById('table');
	console.log(table)
	table.classList.add('winborder');
	table.classList.remove('unsolved-border');
}

if (url[1] == "slide") {
	var tiles = [];
	var image = 0;
	var max;
	
	var tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9, tile10, 
		tile11, tile12, tile13, tile14, tile15, tile16;
	
	//check difficulty setting
	if (document.getElementById('cell33').className === "tile9") { max = 3;}
	else { max = 4; }

	if (url[2] == 1) {
		image = 1;
		tiles = document.getElementsByClassName('tiles');
		console.log(tiles);
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles2');
			console.log(tile.className);
		});
	}
	else if (url[2] == 2) {
		image = 2;
		tiles = document.getElementsByClassName('tiles');
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles3');
			console.log(tile.className);
		});
	}
	else if (url[2] == 3) {
		image = 3;
		tiles = document.getElementsByClassName('tiles');
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles4');
			console.log(tile.className);
		});
	}
	
	//event listeners and functionality for easier slide puzzles
	if (max === 3)
	{		
		shuffle();
		set_timer(false);

		var newgame = document.getElementById('newgame');
		newgame.addEventListener("click", function(){
			shuffle();
			set_timer(true);
			set_timer(false);
		});

		for (var i = 1; i <= 3; i++)
		{
			for (var j = 1; j <= 3; j++)
			{
				(function() {
					var name = 'cell' + i + j;
					var row = i;
					var col = j;
					document.getElementById(name).addEventListener("click", function(){
						var solved = click_tile(row, col, max);
						if (solved === true) { display_solved(image); }
					});
				}());
			}
		}
	}
	//event listeners and functionality for hard slide puzzles
	else if (max === 4)
	{
		shuffle();
		set_timer(false);

		var newgame = document.getElementById('newgame');
		newgame.addEventListener("click", function(){
			shuffle();
			set_timer(false);
		});
		
		for (var i = 1; i <= 4; i++)
		{
			for (var j = 1; j <= 4; j++)
			{
				(function() {
					var name = 'cell' + i + j;
					var row = i;
					var col = j;
					document.getElementById(name).addEventListener("click", function(){
						var solved = click_tile(row, col, max);
						if (solved === true) { display_solved(image); }
					});
				}());
			}
		}
	}

}

/****************************************************
SUDOKU PUZZLE
*****************************************************/
function check_sudoku()
{
	var current_box;
	var current_col;
	var current_row;
	var temp = [];
	for (var i = 1; i <= 9; i++)
	{
		//check all the boxes
		current_box = 'box' + i;
		let box = document.getElementsByClassName(current_box);
		Array.from(box).forEach(entry => {
			temp.push(entry.textContent);
		});
		
		if (!(temp.includes('1') && temp.includes('2') && temp.includes('3') &&
			temp.includes('4') && temp.includes('5') && temp.includes('6') && 
			temp.includes('7') && temp.includes('8') && temp.includes('9')))
			return false;
		
		temp = [];
		
		//check all the columns
		current_col = 'col' + i;
		let current_col = document.getElementsByClassName(current_col);
		Array.from(box).forEach(entry => {
			temp.push(entry.textContent);
		});
		
		if (!(temp.includes('1') && temp.includes('2') && temp.includes('3') &&
			temp.includes('4') && temp.includes('5') && temp.includes('6') && 
			temp.includes('7') && temp.includes('8') && temp.includes('9')))
			return false;
		
		//check all the rows
		current_row = 'row' + i;
		let current_row = document.getElementById(current_row);
		for (const child of current_row.children) { temp.push(child.textContent); }
		if (!(temp.includes('1') && temp.includes('2') && temp.includes('3') &&
			temp.includes('4') && temp.includes('5') && temp.includes('6') && 
			temp.includes('7') && temp.includes('8') && temp.includes('9')))
			return false;
	}
	return true;
}

function select_square(square)
{
	//select square, then select number to place into square
	console.log(square + " clicked");
	var square = document.getElementById(square);
	var col = square.classList[2];
	var row = square.parentElement.classList[0];
	
	//visually select the square, showing row and column it's in
	Array.from(square.parentElement.children).forEach(function (tile) {
		tile.classList.add('selected-row-col');
	});
	Array.from(document.getElementsByClassName(col)).forEach(function (tile) {
		tile.classList.add('selected-row-col');
	});
	square.classList.add('selected-square');
}

function fill_square(number)
{
	//find the selected square and fill it with provided number
	console.log('fill with number ' + number);
	
	//fill in square
	var square = document.getElementsByClassName('selected-square')[0];
	square.textContent = number;
	square.classList.remove('selected-square');
	
	//remove visual highlighting
	Array.from(document.getElementsByClassName('selected-row-col')).forEach(function (tile) {
		tile.classList.remove('selected-row-col');
	});
	
}

function generate_sudoku()
{
	//empty array and fill with 81 zeroes
	sudoku_array = [];
	for (var i = 0; i < 81; i++) { sudoku_array.push('0'); } 
}



if (url[1] == "sudoku")
{
	console.log("sudoku time");
	set_timer(false);
	
	var newgame = document.getElementById('newgame');
		newgame.addEventListener("click", function(){
			set_timer(true);
			set_timer(false);
		});
	
	//Set up event listeners for sudoku squares
	for (var i = 1; i <= 9; i++)
	{
		for (var j = 1; j <= 9; j++)
		{
			(function() {
				var name = 'cell' + i + j;
				document.getElementById(name).addEventListener("click", function(){
					select_square(name);
				});
			}());
		}
	}
	
	//Set up event listeners for number buttons
	for (var i = 1; i <= 9; i++)
	{
		(function() {
			var name = i;
			document.getElementById(name).addEventListener("click", function(){
				fill_square(name);
			});
		}());
	}
}

/****************************************************
SCOREBOARD
*****************************************************/
if (url[1] == "score")
{
	console.log("welcome to scoreboard");
}
