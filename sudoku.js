"use strict";

var Board = (function() {
    var hiddenBoard = new Array(81);

    function rowSafe(lastRow, index) {
	return (lastRow[index] === undefined);
    }
    
    function colSafe(arr, index, num) {
	//make sure the current number isn't already used in this column
	for (var rowIndex = arr.length - 1; rowIndex >= 0; --rowIndex) {
	    if (arr[rowIndex][index] === num) {
		return false;
	    }
	}
	return true;
    }
    
    function boxSafe(boxesUsed, index) {
	var indexBox = Math.floor(index / 3);
	return (boxesUsed.indexOf(indexBox) < 0);
    }
    
    //used to find a safe column to place the number in the current row
    function findSafeIndex(boxesUsed, num, arr, lastRow, safeIndexes) {
	for (var index = 0, rowLen = lastRow.length; index < rowLen; ++index) {
	    if (rowSafe(lastRow, index) && colSafe(arr, index, num) && boxSafe(boxesUsed, index)) {
		safeIndexes.push(index);
	    }
	}

	return safeIndexes[Math.floor(Math.random() * safeIndexes.length)];
    }

    function placeNumber(num, arr) {
        var lastRowIndex = arr.length - 1;
        var lastRow = arr[lastRowIndex];
        var rowsToCheck = lastRowIndex % 3;
        var safeIndexes = [];
        var randomSafeIndex;	
        var horizontalBoxesUsed = [];

        if (rowsToCheck > 0) {
            for (var i = rowsToCheck; i > 0; --i) {
                var horizontalBox = Math.floor(arr[lastRowIndex - i].indexOf(num) / 3);
                horizontalBoxesUsed.push(horizontalBox);
            }
        }

        //get a safe index to put the number in to the row
        randomSafeIndex = findSafeIndex(horizontalBoxesUsed, num, arr, lastRow, safeIndexes);

        //if there are no safe indexes return the number
        if (randomSafeIndex === undefined) {
            return true;
        } else {
            lastRow[randomSafeIndex] = num;
            return false;
        }
    }

    //-----------------------------------------------------------------
    function _genSimple() {
	/*************
        // one simple pattern to create a valid board
	1,2,3,4,5,6,7,8,9   --> base row 1
	4,5,6,7,8,9,1,2,3   --> shift base row 1 by 3 to right
	7,8,9,1,2,3,4,5,6   --> shift base row 1 by 6 to right
	2,3,4,5,6,7,8,9,1   --> shift base row 1 by 1 to right (base row 2)
	5,6,7,8,9,1,2,3,4   --> shift base row 2 by 3 to right
	8,9,1,2,3,4,5,6,7   --> shift base row 2 by 6 to right
	3,4,5,6,7,8,9,1,2   --> shift base row 1 by 2 to right (base row 3)
	6,7,8,9,1,2,3,4,5   --> shift base row 3 by 3 to right
	9,1,2,3,4,5,6,7,8   --> shift base row 3 by 6 to right
	***********/

	// build first row randomly
	var firstRowValues = new Array(1,2,3,4,5,6,7,8,9);
	for (var i=0; i<8; i++) {
	    var pos = Math.floor(Math.random() * firstRowValues.length);
	    hiddenBoard[i] = firstRowValues[pos];
	    firstRowValues.splice(pos, 1);
	}
	hiddenBoard[8] = firstRowValues[0];

	// build 2nd and 3rd rows by shifting by triples
	copyTriple(1, 0, 0, 3); copyTriple(1, 3, 0, 6); copyTriple(1, 6, 0, 0);
	copyTriple(2, 0, 0, 6); copyTriple(2, 3, 0, 0); copyTriple(2, 6, 0, 3);
	// build 4th from 1st by shifting one column
	for (var i=0; i<8; i++) {
	    hiddenBoard[3*9 + i] = hiddenBoard[i + 1];
	}
	hiddenBoard[3*9 + 8] = hiddenBoard[0];
	copyTriple(4, 0, 3, 3); copyTriple(4, 3, 3, 6); copyTriple(4, 6, 3, 0);
	copyTriple(5, 0, 3, 6); copyTriple(5, 3, 3, 0); copyTriple(5, 6, 3, 3);

	// build 7th from 1st by shifting two columns
	hiddenBoard[6*9 + 0] = hiddenBoard[2];
	for (var i=1; i<7; i++) {
	    hiddenBoard[6*9 + i] = hiddenBoard[i + 2];
	}
	hiddenBoard[6*9 + 7] = hiddenBoard[0];
	hiddenBoard[6*9 + 8] = hiddenBoard[1];
	copyTriple(7, 0, 6, 3); copyTriple(7, 3, 6, 6); copyTriple(7, 6, 6, 0);
	copyTriple(8, 0, 6, 6); copyTriple(8, 3, 6, 0); copyTriple(8, 6, 6, 3);

	shuffleColumns([0,1,2]);
	shuffleColumns([3,4,5]);
	shuffleColumns([6,7,8]);

	shuffleRows([0,1,2]);
	shuffleRows([3,4,5]);
	shuffleRows([6,7,8]);
    }


    function copyTriple(rowOut, colOut, rowIn, colIn) {
	hiddenBoard[rowOut*9 + colOut+0] = hiddenBoard[rowIn*9 + colIn+0];
	hiddenBoard[rowOut*9 + colOut+1] = hiddenBoard[rowIn*9 + colIn+1];
	hiddenBoard[rowOut*9 + colOut+2] = hiddenBoard[rowIn*9 + colIn+2];
    }
    
    function shuffleColumns(cols) {
	var col_1 = cols[Math.floor(Math.random() * cols.length)];
	var col_2 = cols[Math.floor(Math.random() * cols.length)];
	while (col_1 == col_2) {
	    col_2 = cols[Math.floor(Math.random() * cols.length)];
	}
	//alert("shuffleColumns() col_1=" + col_1 + " col_2=" + col_2);
	for (var i=0; i<9; i++) {
	    var temp = hiddenBoard[i*9 + col_1];
	    hiddenBoard[i*9 + col_1] = hiddenBoard[i*9 + col_2];
	    hiddenBoard[i*9 + col_2] = temp;
	}
    }
    
    function shuffleRows(rows) {
	var row_1 = rows[Math.floor(Math.random() * rows.length)];
	var row_2 = rows[Math.floor(Math.random() * rows.length)];
	while (row_1 == row_2) {
	    row_2 = rows[Math.floor(Math.random() * rows.length)];
	}
	//alert("shuffleRows() row_1=" + row_1 + " row_2=" + row_2);
	for (var i=0; i<9; i++) {
	    var temp = hiddenBoard[9*row_1 + i];
	    hiddenBoard[9*row_1 + i] = hiddenBoard[9*row_2 + i];
	    hiddenBoard[9*row_2 + i] = temp;
	}
    }
    

    //-----------------------------------------------------------------
    const UNASSIGNED_CELL = 0;
    
    function _genMedium() {
	//alert("genMedium");
	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		hiddenBoard[row*9 + col] = UNASSIGNED_CELL;
	    }
	}
	hiddenBoard[0] = Math.floor(Math.random() * 10);

	var firstRowValues = new Array(1,2,3,4,5,6,7,8,9);
	for (var i=0; i<8; i++) {
	    var pos = Math.floor(Math.random() * firstRowValues.length);
	    hiddenBoard[i] = firstRowValues[pos];
	    firstRowValues.splice(pos, 1);
	}
	hiddenBoard[8] = firstRowValues[0];
	fillMedium();
    }
    
    function fillMedium() {
	// If there is no unassigned location, we are done
	var unassigned = findUnassignedLocation();
	if (unassigned < 0)
	    return true;

	// try all values (ie, 1..9)
	for (var value=1; value<=9; value++) {
	    if (isSafe(unassigned, value)) {
		hiddenBoard[unassigned] = value;
		if (true == fillMedium()) {
		    return true;
		}
		hiddenBoard[unassigned] = UNASSIGNED_CELL;
	    }
	}
	return false;	// this triggers backtracking
    }

    function findUnassignedLocation() {
	for (var i=9; i < 9*9; i++) {
	    if (hiddenBoard[i] == UNASSIGNED_CELL)
		return i;
	}
	return -1;
    }

    function UsedInRow(row, num) {
	for (var i=0; i<9; i++) {
	    var cell = (row * 9) + i;
	    if (hiddenBoard[cell] == num)
		return true;
	}
	return false;
    }
    
    function UsedInCol(col, num) {
	for (var i=0; i<9; i++) {
	    var cell = (i * 9) + col;
	    if (hiddenBoard[cell] == num)
		return true;
	}
	return false;
    }
    
    function UsedInBox(row, col, num) {
	var startRow = row - (row % 3);
	var startCol = col - (col % 3);
	for (var r=0; r<3; r++)
	    for (var c=0; c<3; c++) {
		var cell = (startRow + r) * 9;
		cell += startCol + c;
		if (hiddenBoard[cell] == num)
		    return true;
	    }
	return false;
    }

    // checks whether it will be legal to assign num to the given row, col
    function isSafe(spot, num) {
	var row = Math.floor(spot / 9);
	var col = spot % 9;
	//console.log("isSafe() spot = " + spot + " row=" + row + " col=" + col);
	return hiddenBoard[spot] == UNASSIGNED_CELL
	    && !UsedInRow(row, num)
	    && !UsedInCol(col, num)
	    && !UsedInBox(row - row % 3, col - col % 3, num);
    }

    //-----------------------------------------------------------------
    function _genHard(iteration = 0) {
	//alert("genHard");
        var sudokuArray = [];
        for (var i = 0; i < 9; ++i) {
            sudokuArray.push(new Array(9));
        }

        for (var i=1; i <= 9; i++) {
            var workingArray = [];
            while (sudokuArray.length > 0) {
                workingArray.push(sudokuArray.shift());

                if (placeNumber(i, workingArray)) {
                    return _genHard(++iteration);
                }
            }

            // save the successful pattern
            sudokuArray = workingArray;
        }

        //alert("interations=" + iteration);
	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		hiddenBoard[row*9 + col] = sudokuArray[row][col];
	    }
	}
    }
    
    //-----------------------------------------------------------------
    
    function _getCell(row, col) {
	return hiddenBoard[row*9 + col];	
    }

    // expose API
    return {
	'genSimple': _genSimple,
	'genMedium': _genMedium,
	'genHard': _genHard,
	'get': _getCell,
    };
})();


// globals...
var Selected_Row = 0;
var Selected_Col = 0;

function doNothing(event) {
    return;
}

// selects the cell clicked on by the user
function selectCell(event) {
    var x = event.clientX;
    var y = event.clientY;
    //alert("X coords: " + x + ", Y coords: " + y);
    // Javascript hack -- assume 'this' goes up call stack
    var fields = this.id.split('-');
    //alert("select row=" + fields[1] + " col=" + fields[2]);
    Selected_Row = fields[1];
    Selected_Col = fields[2];
    // reset all errors
    for (var row=0; row<9; row++) {
	for (var col=0; col<9; col++) {
	    var cell = document.getElementById('cell-' + row + '-' + col);
	    if (cell.style.color == 'red')
		//alert ("RESET background=" + cell.style.background);
		if (cell.style.background.indexOf('gray') >= 0) {
		    cell.style.color = 'blue';
		} else {
		    cell.style.color = 'black';
		}
	}
    }
    
    var taken = new Array(10);
    for (var i=0; i<=9; i++) {
	taken[i] = false;
    }
    for (var col=0; col<9; col++) {
	if (col == Selected_Col) continue;
	var cell = document.getElementById('cell-' + Selected_Row + '-' + col);
	//alert("ROW CHECK (" + Selected_Row + ', ' + col + ") =" + cell.innerHTML);
	var val = parseInt(cell.innerHTML);
	if (val > 0) {
	    taken[val] = true;
	}
    }
    for (var row=0; row<9; row++) {
	if (row == Selected_Row) continue;
	var cell = document.getElementById('cell-' + row + '-' + Selected_Col);
	//alert("COL CHECK (" + row + ', ' + Selected_Col + ") =" + cell.innerHTML);
	var val = parseInt(cell.innerHTML);
	if (val > 0) {
	    taken[val] = true;
	}
    }
    var colLow = Math.floor(Selected_Col/3)*3;
    var colHigh = colLow + 3;
    var rowLow = Math.floor(Selected_Row/3)*3;
    var rowHigh = rowLow + 3;
    
    for (var row=rowLow; row<rowHigh; row++) {
	for (var col=colLow; col<colHigh; col++) {
	    if (row == Selected_Row && col == Selected_Col) continue;
	    var cell = document.getElementById('cell-' + row + '-' + col);
	    //alert("3x3 CHECK (" + row + ', ' + col + ") =" + cell.innerHTML);
	    var val = parseInt(cell.innerHTML);
	    if (val > 0) {
		taken[val] = true;
	    }
	}
    }
    //alert("TAKEN=" + taken);
    for (var i=1; i<=9; i++) {
	var popup_num = document.getElementById('numberpad_' + i);
	if (taken[i] == true) {
	    popup_num.style.color = 'gray';
	    popup_num.style.fontWeight = 'normal';
	    popup_num.style.fontSize = 'small';
	} else {
	    popup_num.style.color = 'blue';
	    popup_num.style.fontWeight = 'normal';
	    popup_num.style.fontSize = 'large';
	}
    }
    var popup = document.getElementById('PopUp');
    popup.style.position = 'absolute';
    //popup.style.clientX = (x-35) + 'px';
    //popup.style.clientY = (y-35) + 'px';
    if (x < 35) x = 35;
    if (y < 35) y = 35;
    popup.style.left = (x-35) + 'px';
    popup.style.top = (y-35) + 'px';
    popup.style.display = 'block';
    popup.style.zIndex = '1000';
    //popup.style.visibility = 'visible';
}


var Sudoku = (function() {
    function initGame(level) {
	runGame(level, true);
    }

    function newGame(level) {
	runGame(level, false);
    }
    
    function runGame(level, init) {
	//alert('play');
	var msg = document.getElementById('GameMessage');
	msg.innerHTML = "";
	if (level == 1) {
	    Board.genSimple();
	} else if (level == 2) {
	    Board.genMedium();
	} else if (level == 3) {
	    Board.genHard();
	} else {
	    alert("ERROR - Invalid game level ", + level);
	    return false;
	}
	showBoard(level);
	if (init) {
	    Timer.init('stopwatch');
	} else {
	    Timer.reset();
	}
	Timer.start();
    }
    
    function findDuplicates(num, cell) {
	var foundDuplicate = false;
	for (var col=0; col<9; col++) {
	    if (col == Selected_Col) continue;
	    var cell2 = document.getElementById('cell-' + Selected_Row + '-' + col);
	    var val = parseInt(cell2.innerHTML);
	    if (val == num) {
		foundDuplicate = true;
		cell.style.color = 'red';
		cell2.style.color = 'red';
	    }
	}
	for (var row=0; row<9; row++) {
	    if (row == Selected_Row) continue;
	    var cell2 = document.getElementById('cell-' + row + '-' + Selected_Col);
	    var val = parseInt(cell2.innerHTML);
	    if (val == num) {
		foundDuplicate = true;
		cell.style.color = 'red';
		cell2.style.color = 'red';
	    }
	}
	var colLow = Math.floor(Selected_Col/3)*3;
	var colHigh = colLow + 3;
	var rowLow = Math.floor(Selected_Row/3)*3;
	var rowHigh = rowLow + 3;
	for (var row=rowLow; row<rowHigh; row++) {
	    for (var col=colLow; col<colHigh; col++) {
		if (col == Selected_Col && row == Selected_Row) continue;
		var cell2 = document.getElementById('cell-' + row + '-' + col);
		var val = parseInt(cell2.innerHTML);
		if (val == num) {
		    foundDuplicate = true;
		    cell.style.color = 'red';
		    cell2.style.color = 'red';
		}
	    }
	}
	return foundDuplicate;
    }
    
    function pickNumber(num) {
	//alert('numberpicked ' + num + " for row=" + Selected_Row + " col=" + Selected_Col);
	var popup = document.getElementById('PopUp');
	popup.style.display = 'none';

	var cell = document.getElementById('cell-' + Selected_Row + '-' + Selected_Col);
	var dup = findDuplicates(num, cell);


	// if set with .style can't over-ride using .classname - Firefox bug?
	if (dup == false) {
	    cell.style.color = 'black';
	}
	cell.style.background = '#BBFFFF;';
	cell.innerHTML = num;
	
	var numRemaining = 0;
	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		var c = document.getElementById('cell-' + row + '-' + col);
		//alert('cell-' + row + '-' + col + '=' + cell.innerHTML);
		if (isNaN(c.innerHTML))
		    numRemaining += 1;
	    }
	}
	
	if (dup == true)
	    numRemaining += 1;
	var counter = document.getElementById('cellsRemaining');
	counter.innerHTML = numRemaining;
	
	checkIfGameIsOver();
    }
    
    function checkIfGameIsOver() {
	var counter = document.getElementById('cellsRemaining');
	var val = parseInt(counter.innerHTML);
	if (val == 0) {
	    var msg = document.getElementById('GameMessage');
	    msg.innerHTML = "Game over";
	    Timer.stop();
	    return true;
	}
	return false;
    }
    
    function showBoard(level) {
	var levelReveals = [81,36,30,24]; // debug, easy, medium, hard
	var openCells = 81;
	// set all cells to hidden/playable
	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		var cell = document.getElementById('cell-' + row + '-' + col);
		cell.style.color = 'orange';
		cell.style.background = 'white';
		cell.innerHTML = '?';
		// install the onclick handler
		cell.onclick = selectCell;
	    }
	}
	// randomly reveal some cells
	for (var i=0; i<levelReveals[level]; i++) {
	    Sudoku.revealRandomCell();
	}
    }

    function revealRandomCell() {
	var openCells = [];
	var counter = document.getElementById('cellsRemaining');
	var popup = document.getElementById('PopUp');
	if (popup) popup.style.display = 'none';

	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		var cell = document.getElementById('cell-' + row + '-' + col);
		if (isNaN(cell.innerHTML)) {
		    openCells.push({'row':row, 'col':col});
		}
	    }
	}
	if (openCells.length == 0) return;

	var pos = Math.floor(Math.random() * openCells.length);
	var row = openCells[pos].row;
	var col = openCells[pos].col;
	var cell = document.getElementById('cell-' + row + '-' + col);
	cell.style.color = 'blue';
	cell.style.background = 'gray';
	cell.onclick = doNothing;
	cell.innerHTML = Board.get(row, col);
	counter.innerHTML = openCells.length - 1;
	checkIfGameIsOver();
    }
    
    function revealBoard() {
	//alert("revealBoard");
	Timer.stop();
	for (var row=0; row<9; row++) {
	    for (var col=0; col<9; col++) {
		var cell = document.getElementById('cell-' + row + '-' + col);
		cell.innerHTML = Board.get(row, col);
	    }
	}
    }
    
    return {
	'initGame': initGame,
	'newGame': newGame,
	'pickNumber': pickNumber,
	'revealRandomCell': revealRandomCell,
	'revealBoard': revealBoard
    };
})();
