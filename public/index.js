var url = window.location.pathname.split('/');

/****************************************************
SLIDE PUZZLE
*****************************************************/
function click_tile(row, col, max) {
	var cell = document.getElementById("cell" + row + col);
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
	var lastCell = document.getElementById('cell33');
	if (inversions == 0 && lastCell.classList[0] == 'tile9')
		return true;
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
	//console.log("Order: ", order);
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

	if (max === 3)
	{
		tile1 = document.getElementById('cell11');
		tile2 = document.getElementById('cell12');
		tile3 = document.getElementById('cell13');

		tile4 = document.getElementById('cell21');
		tile5 = document.getElementById('cell22');
		tile6 = document.getElementById('cell23');

		tile7 = document.getElementById('cell31');
		tile8 = document.getElementById('cell32');
		tile9 = document.getElementById('cell33');
		
		shuffle();

		var newgame = document.getElementById('newgame');
		newgame.addEventListener("click", shuffle);

		tile1.addEventListener("click", function () {
			var solved = click_tile(1, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile2.addEventListener("click", function () {
			var solved = click_tile(1, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile3.addEventListener("click", function () {
			var solved = click_tile(1, 3, max);
			if (solved === true)
				display_solved(image);
		});

		tile4.addEventListener("click", function () {
			var solved = click_tile(2, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile5.addEventListener("click", function () {
			var solved = click_tile(2, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile6.addEventListener("click", function () {
			var solved = click_tile(2, 3, max);
			if (solved === true)
				display_solved(image);
		});

		tile7.addEventListener("click", function () {
			var solved = click_tile(3, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile8.addEventListener("click", function () {
			var solved = click_tile(3, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile9.addEventListener("click", function () {
			var solved = click_tile(3, 3, max);
			if (solved === true)
				display_solved(image);
		});
	}
	else if (max === 4)
	{
		tile1 = document.getElementById('cell11');
		tile2 = document.getElementById('cell12');
		tile3 = document.getElementById('cell13');
		tile4 = document.getElementById('cell14');
		
		tile5 = document.getElementById('cell21');
		tile6 = document.getElementById('cell22');
		tile7 = document.getElementById('cell23');
		tile8 = document.getElementById('cell24');
		
		tile9 = document.getElementById('cell31');		
		tile10 = document.getElementById('cell32');
		tile11 = document.getElementById('cell33');
		tile12 = document.getElementById('cell34');
		
		tile13 = document.getElementById('cell41');		
		tile14 = document.getElementById('cell42');
		tile15 = document.getElementById('cell43');
		tile16 = document.getElementById('cell44');
		
		shuffle();

		var newgame = document.getElementById('newgame');
		newgame.addEventListener("click", shuffle);

		tile1.addEventListener("click", function () {
			var solved = click_tile(1, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile2.addEventListener("click", function () {
			var solved = click_tile(1, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile3.addEventListener("click", function () {
			var solved = click_tile(1, 3, max);
			if (solved === true)
				display_solved(image);
		});
		tile4.addEventListener("click", function () {
			var solved = click_tile(1, 4, max);
			if (solved === true)
				display_solved(image);
		});
		
		tile5.addEventListener("click", function () {
			var solved = click_tile(2, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile6.addEventListener("click", function () {
			var solved = click_tile(2, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile7.addEventListener("click", function () {
			var solved = click_tile(2, 3, max);
			if (solved === true)
				display_solved(image);
		});
		tile8.addEventListener("click", function () {
			var solved = click_tile(2, 4, max);
			if (solved === true)
				display_solved(image);
		});
		
		tile9.addEventListener("click", function () {
			var solved = click_tile(3, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile10.addEventListener("click", function () {
			var solved = click_tile(3, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile11.addEventListener("click", function () {
			var solved = click_tile(3, 3, max);
			if (solved === true)
				display_solved(image);
		});
		tile12.addEventListener("click", function () {
			var solved = click_tile(3, 4, max);
			if (solved === true)
				display_solved(image);
		});
		
		tile13.addEventListener("click", function () {
			var solved = click_tile(4, 1, max);
			if (solved === true)
				display_solved(image);
		});
		tile14.addEventListener("click", function () {
			var solved = click_tile(4, 2, max);
			if (solved === true)
				display_solved(image);
		});
		tile15.addEventListener("click", function () {
			var solved = click_tile(4, 3, max);
			if (solved === true)
				display_solved(image);
		});
		tile16.addEventListener("click", function () {
			var solved = click_tile(4, 4, max);
			if (solved === true)
				display_solved(image);
		});
	}

}