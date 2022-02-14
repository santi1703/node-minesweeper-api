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

		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				var square = new Square(i, j, this.hasMine(minePositions, i, j));
				field.push(square);
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
}

class Square {
	constructor(x, y, hasMine, isVisible = false) {
		this.x = x;
		this.y = y;
		this.hasMine = hasMine;
		this.isVisible = isVisible;
	}
}

exports.MineField = MineField;
exports.Square = Square;