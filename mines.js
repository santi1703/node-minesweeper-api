class MineField {
	constructor(width = 30, height = 16, mines = 99) {
		this.width = width;
		this.height = height;
		this.mines = Math.min(mines, width * height - Math.ceil(width * height / 10));
		this.field = this.generateField();
	}

	generateField() {
		var field = [];
		var minePositions = this.setMines(this.width, this.height, this.mines);

		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				var mine = new Square(i, j, this.hasMine(minePositions, i, j))
				field.push(mine);
			}
		}

		return field;
	}

	setMines() {
		var remainingMines = this.mines;
		var minePositions = [];

		while(remainingMines > 0)
		{
			var xPos = Math.floor( Math.random() * this.width);
			var yPos = Math.floor( Math.random() * this.height);
			if(!minePositions.some(e => e[0] === xPos && e[1] === yPos)) {
				minePositions.push([xPos, yPos]);
				remainingMines--;
			}
		}

		return minePositions;
	}

	hasMine(positions, x, y) {
		return positions.some(e => e[0] === x && e[1] === y);
	}

	getSquare(x, y) {
		return this.field[x][y];
	}

	revealSquare(x, y) {
		var square = this.field[x][y];
		if(square.isVisible) {
			alert('This square is already revealed');
		} else {
			square.isVisible = true;
		}
	}

	getPreview()
	{
		var fieldString = '';
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				var square = this.getSquare(i, j);

				if(square.isVisible) {
					if(square.hasMine) {
						fieldString += 'X';
					}else{
						fieldString += '-';
					}
				}else{
					fieldString += square.getMineInteger();
				}
			}
			fieldString += "\n";
		}

		console.log(fieldString);
		return fieldString;
	}

	getVisibleField()
	{
		var fieldString = '';
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				var square = this.getSquare(i, j);

				if(square.isVisible) {
					fieldString += square.getSurroundingMines();
				}else{
					fieldString += '-';
				}
			}
			fieldString += "\n";
		}

		console.log(fieldString);
		return fieldString;
	}
}

class Square {
	constructor(minefield, x, y, hasMine, isVisible = false) {
		this.minefield = minefield;
		this.x = x;
		this.y = y;
		this.hasMine = hasMine;
		this.isVisible = isVisible;
	}

	getSurroundingMines()
	{
		var surroundingMines = 0;

		if(this.x > 0) {
			surroundingMines += this.checkMinesAbove();
		}

		if(this.x < this.minefield.height - 1) {
			surroundingMines += this.checkMinesBelow();
		}

		surroundingMines += this.checkMinesLeftRight();

		return surroundingMines;
	}

	checkMinesAbove()
	{
		var minesAbove = 0;

		if(this.y > 0) {
			minesAbove += this.minefield.getSquare(this.x - 1, this.y - 1).getMineInteger();
		}

		if(this.y < this.minefield.width - 1) {
			minesAbove += this.minefield.getSquare(this.x - 1, this.y + 1).getMineInteger();
		}

		minesAbove += this.minefield.getSquare(this.x - 1, this.y).getMineInteger();

		return minesAbove;
	}

	checkMinesBelow()
	{
		var minesBelow = 0;

		if(this.y > 0) {
			minesBelow += this.minefield.getSquare(this.x + 1, this.y - 1).getMineInteger();
		}

		if(this.y < this.minefield.width - 1) {
			minesBelow += this.minefield.getSquare(this.x + 1, this.y + 1).getMineInteger();
		}

		minesBelow += this.minefield.getSquare(this.x + 1, this.y).getMineInteger();

		return minesBelow;
	}

	checkMinesLeftRight()
	{
		var minesLeftRight = 0;

		if(this.y > 0) {
			minesLeftRight += this.minefield.getSquare(this.x, this.y - 1).getMineInteger();
		}

		if(this.y < this.minefield.width - 1) {
			minesLeftRight += this.minefield.getSquare(this.x, this.y + 1).getMineInteger();
		}

		return minesLeftRight;
	}

	getMineInteger()
	{
		return this.hasMine === true ? 1 : 0;
	}
}

exports.MineField = MineField;
exports.Square = Square;