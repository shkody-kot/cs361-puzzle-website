var url = window.location.pathname.split('/');
const post_url = window.location.protocol + '/add';

//global timer variables
var counting;
var disable_timer, enable_timer;

//global sudoku variables
var sudoku_array = [];
var user_array = [];
var notes, solutions;
/****************************************************
POST REQUEST
*****************************************************/
function add_score(game, name, time)
{
	if (!validate) { return; }
	
	var new_score = {
		game: game,
		name: name, 
		time: time
	};
	unhide_form();
	
	post('/add', new_score).then(data => {console.log(data); });
	
	unhide_form();
}

async function post(url, data)
{
	console.log(data);
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return response.json();
}

function unhide_form() {
	var modal = document.getElementById("score-modal");
	var backdrop = document.getElementById("modal-backdrop");
	if (modal.style.display === "none" && backdrop.style.display === "none") {
		modal.style.display = "block";
		backdrop.style.display = "block";
	}
	else {
		modal.style.display = "none";
		backdrop.style.display = "none";

		document.getElementById('name-input').value = '';
	}
}

function validate() {
	var name = document.getElementById('name-input').value;
	if (name == '')
	{
		alert("Name cannot be empty");
		return false;
	}
	else { return true; }
}

if (url[1] == 'slide' || url[1] == 'sudoku' || url[1] == 'memory')
{
	unhide_form();
	var game = url[1];
	
	//on button click, open/close the form
	document.getElementsByClassName("add-fact-button")[0].addEventListener("click", unhide_modal);

	var close = document.querySelector('.modal-close-button');
	var cancel = document.querySelector('.modal-cancel-button');

	close.onclick = unhide_form;
	cancel.onclick = unhide_form;

	//on button click, create a new fact
	var container = document.querySelector('.puzzle-container');
	var create = document.querySelector('.modal-accept-button');

	create.addEventListener("click", function () {
		console.log("hi");
		add_fact( game,
			document.getElementById('name-input').value,
			document.getElementById('timer').textContent);
		unhide_form();
	});
}

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
	//if board is odd-sized
	if (document.getElementById('cell33').className === "tile9")
	{
		if (inversions % 2 === 0) { return true; }
		else { return false; }
	}
	//if board is even-sized
	else if (document.getElementById('cell44') != null)
	{
		var row_num = parseInt(document.getElementsByClassName('tile16')[0].parentElement.id[3]);
		console.log(inversions + row_num);
		if ((inversions + row_num - 1) % 2 === 0) { return false; }
		else { return true; }
	}
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
		var num;
		if (square[4] == 0) { num = square[5]; }
		else if (square[5] == undefined) { num = parseInt(square[4]); }
		else {  num = parseInt(square[4] + square[5]);}
		order.push(num);
	}
	//console.log("Order: ", order);
	var inversions = 0;
	for (let i = 0; i < order.length; i++) {
		for (let x = i + 1; x < order.length; x++) {
			if (order[i] > order[x])
			{
				console.log("length: " + order.length + " " + order[i] + " " + order[x]);
				inversions = inversions + 1;
			}
		}
	}
	console.log(inversions);
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
function legal_move(square, value)
{
	
}

function check_sudoku()
{
	//checks if the user filled in the grid correctly
	for (var i = 0; i < 81; i++)
	{
		if (user_array[i] != sudoku_array[i]) { return false; }
	}
	
	return true;
}

function select_square(square)
{
	//clear any previous selection
	Array.from(document.getElementsByClassName('selected-row-col')).forEach(function (tile) {
		tile.classList.remove('selected-row-col');
	});
	var temp = document.getElementsByClassName('selected-square')[0];
	if (temp != null ) { temp.classList.remove('selected-square'); }
	
	//select square, then select number to place into square
	console.log(square + " clicked");
	var square = document.getElementById(square);
	
	//if it's a provided square value, do not allow selection
	if (square.classList.contains('auto')) { return; }
	
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
	square.classList.add('full');
	
	//add value of square to user array
	var row, col;
	row = parseInt(square.id[4]) - 1;
	col = parseInt(square.id[5]) - 1;
	user_array[row * 9 + col] = number;
	
	//remove visual highlighting
	Array.from(document.getElementsByClassName('selected-row-col')).forEach(function (tile) {
		tile.classList.remove('selected-row-col');
	});
	if (check_sudoku() == true)
	{
		set_timer(true);
		document.getElementById('game-play-message').classList.add('hide');
		document.getElementById('solved-message').classList.remove('hide');
		
		document.getElementById('newgame').classList.add('hide');
		document.getElementById('back-button').classList.add('hide');
		document.getElementById('enable').classList.add('hide');
		document.getElementById('disable').classList.add('hide');
		document.getElementById('solved-play-again').classList.remove('hide');
		document.getElementById('puzzle-solved-buttons').classList.remove('hide');
		document.getElementById('add-score').classList.remove('hide');
		
		var table = document.getElementById('table');
		table.classList.add('winborder');
		table.classList.remove('unsolved-border');
	}
}

function check_grid_full(grid)
{
	for (var i = 0; i < 81; i++)
	{
		if (grid[i] == 0) { return false; }
	}
	//grid is completely full
	return true;
}

//shuffles an array
function random_index(array)
{
	var temp, random;
	for (var i = 0; i < array.length; i++)
	{
		temp = array[i];
		random = array.length * Math.random() | 0;
		array[i] = array[random];
		array[random] = temp;
	}
	return array;
}

function backtrack(grid)
{
	for (var i = 0; i < 81; i++)
	{
		row = parseInt(i / 9);
		col = i % 9;
		//if cell is blank:
		if (grid[row * 9 + col] == 0)
		{
			for (var index = 0; index < 9; index++)
			{
				var number = index + 1;
				//check that this number has not been used in current row
				if (number != grid[row * 9 + 0] && number != grid[row * 9 + 1] && number != grid[row * 9 + 2] && 
					number != grid[row * 9 + 3] && number != grid[row * 9 + 4] && number != grid[row * 9 + 5] && 
					number != grid[row * 9 + 6] && number != grid[row * 9 + 7] && number != grid[row * 9 + 8])
				{
					//check that this number is not in the current column
					//console.log('no duplicates in row, checking column for value ' + number);
					if (number != grid[0 * 9 + col] && number != grid[1 * 9 + col] && number != grid[2 * 9 + col] && 
						number != grid[3 * 9 + col] && number != grid[4 * 9 + col] && number != grid[5 * 9 + col] && 
						number != grid[6 * 9 + col] && number != grid[7 * 9 + col] && number != grid[8 * 9 + col])
					{
						//find the 3x3 square that we're in right now
						//console.log('no duplicates in column, checking square for value ' + number);
						var square = [];
						var row_start, col_start;
						//get rows for square
						if (row < 3) { row_start = 0; }
						else if (row < 6) { row_start = 3; }
						else { row_start = 6; }
						
						//get columns for square
						if (col < 3) { col_start = 0; }
						else if (col < 6) { col_start = 3; }
						else { col_start = 6; }
						
						//add slices of grid into square
						square.push(grid[row_start * 9 + col_start], grid[row_start * 9 + col_start + 1], grid[row_start * 9 + col_start + 2]);
						square.push(grid[(row_start + 1) * 9 + col_start], grid[(row_start + 1) * 9 + col_start + 1], grid[(row_start + 1) * 9 + col_start + 2]);
						square.push(grid.slice((row_start + 2) * 9 + col_start, (row_start + 2) * 9 + col_start + 3));
												
						//if number not in square
						if (square.includes(number) == false)
						{
							grid[row * 9 + col] = number;
							//console.log('no duplicates in square; adding ' + number + ' to row ' + row + ', column ' + col);
							if (check_grid_full(grid) == true) 
							{ 
								solutions += 1; 
								break; 
							}
							else { if (backtrack(grid) == true) { return true; }} 
						}
					}
				}
			}
			break;
		}
	}
	grid[row * 9 + col] = 0;
}

/* Implementation of sudoku generation and backtracking algorithms adopted from:
	- https://www.101computing.net/sudoku-generator-algorithm/
	- https://stackoverflow.com/questions/6924216/how-to-generate-sudoku-boards-with-unique-solutions
*/
function generate_sudoku(grid)
{	
	//numbers array
	var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	var num_filled, row, col;
	
	//generate a completely full valid grid
	for (var i = 0; i < 81; i++)
	{
		row = parseInt(i / 9);
		col = i % 9;
		//console.log('row: ' + row + ' col:' + col);
		//if cell is blank:
		if (grid[row * 9 + col] == 0)
		{
			numbers = random_index(numbers);
			for (var index = 0; index < 9; index++)
			{
				var number = numbers[index];
				//check that this number has not been used in current row
				if (number != grid[row * 9 + 0] && number != grid[row * 9 + 1] && number != grid[row * 9 + 2] && 
					number != grid[row * 9 + 3] && number != grid[row * 9 + 4] && number != grid[row * 9 + 5] && 
					number != grid[row * 9 + 6] && number != grid[row * 9 + 7] && number != grid[row * 9 + 8])
				{
					//check that this number is not in the current column
					//console.log('no duplicates in row, checking column for value ' + number);
					if (number != grid[0 * 9 + col] && number != grid[1 * 9 + col] && number != grid[2 * 9 + col] && 
						number != grid[3 * 9 + col] && number != grid[4 * 9 + col] && number != grid[5 * 9 + col] && 
						number != grid[6 * 9 + col] && number != grid[7 * 9 + col] && number != grid[8 * 9 + col])
					{
						//find the 3x3 square that we're in right now
						//console.log('no duplicates in column, checking square for value ' + number);
						var square = [];
						var row_start, col_start;
						//get rows for square
						if (row < 3) { row_start = 0; }
						else if (row < 6) { row_start = 3; }
						else { row_start = 6; }
						
						//get columns for square
						if (col < 3) { col_start = 0; }
						else if (col < 6) { col_start = 3; }
						else { col_start = 6; }
						
						//add slices of grid into square
						square.push(grid[row_start * 9 + col_start], grid[row_start * 9 + col_start + 1], grid[row_start * 9 + col_start + 2]);
						square.push(grid[(row_start + 1) * 9 + col_start], grid[(row_start + 1) * 9 + col_start + 1], grid[(row_start + 1) * 9 + col_start + 2]);
						square.push(grid.slice((row_start + 2) * 9 + col_start, (row_start + 2) * 9 + col_start + 3));
												
						//if number not in square
						if (square.includes(number) == false)
						{
							grid[row * 9 + col] = number;
							console.log('no duplicates in square; adding ' + number + ' to row ' + row + ', column ' + col);
							if (check_grid_full(grid) == true) { return true; }
							else if (generate_sudoku(grid) == true) { return true; }
						}
					}
				}
			}
			break;
		}
	}
	grid[row * 9 + col] = 0;
}

function remove_entries(initial, user)
{
	//remove certain entries of the grid but maintain a unique solution
	Array.from(document.getElementsByClassName('auto')).forEach(function (tile) {
		tile.classList.remove('auto');
	});
	
	//copy initial grid to the user grid
	for (var i = 0; i < 81; i++) { user[i] = initial[i]; }
	var row, col, temp, backup_grid;
	var attempts = 10;
	solutions = 1;
	
	while (attempts > 0)
	{
		//pick a random cell to leave blank
		row = Math.floor(9 * Math.random());
		col = Math.floor(9 * Math.random());
		while (user[row * 9 + col] == 0) 
		{
			row = Math.floor(9 * Math.random());
			col = Math.floor(9 * Math.random());
		}
		//store the value for backtracking purposes
		temp = user[row * 9 + col];
		user[row * 9 + col] = 0;
		backup_grid = [];
		for (var i = 0; i < 81; i++) { backup_grid[i] = user[i]; }
		
		//check number of solutions
		solutions = 0;
		backtrack(backup_grid);
		console.log(solutions);
		
		if (solutions != 1)
		{
			user[row * 9 + col] = temp;
			attempts -= 1;
		}
		solutions = 0;
		console.log('attemps left: ' + attempts);
	}
}


if (url[1] == "sudoku")
{
	console.log("sudoku time");
	set_timer(false);
	
	//empty array and fill with 81 zeroes
	sudoku_array = [];
	for (var i = 0; i < 81; i++) { sudoku_array.push(0); }
	generate_sudoku(sudoku_array);
	remove_entries(sudoku_array, user_array);
		
	
	var newgame = document.getElementById('newgame');
	newgame.addEventListener("click", function()
	{
		set_timer(true);
		set_timer(false);
		user_array = [];
		for (var i = 0; i < 81; i++) { user_array.push(0); }
		sudoku_array = [];
		for (var i = 0; i < 81; i++) { sudoku_array.push(0); }
		generate_sudoku(sudoku_array);
		remove_entries(sudoku_array, user_array);		
		
		//fill the grid for the user
		for (var i = 1; i <= 9; i++) {
			for (var j = 1; j <= 9; j++) {
				(function() {
					var name = 'cell' + i + j;
					if (user_array[(i - 1) * 9 + (j -1)] != 0)
					{
						document.getElementById(name).classList.add('auto');
						document.getElementById(name).textContent = user_array[(i - 1) * 9 + (j -1)];
					}
					else { document.getElementById(name).textContent = ''; }
				}());
			}
		}
	});
	
	//Set up event listeners for sudoku squares
	for (var i = 1; i <= 9; i++)
	{
		for (var j = 1; j <= 9; j++)
		{
			(function() {
				var name = 'cell' + i + j;
				if (user_array[(i - 1) * 9 + (j -1)] != 0)
				{
					document.getElementById(name).classList.add('auto');
					document.getElementById(name).textContent = user_array[(i - 1) * 9 + (j -1)];
				}
				else { document.getElementById(name).textContent = ''; }
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
