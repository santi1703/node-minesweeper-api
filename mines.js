class MineField {
    constructor(width = 30, height = 16, mines = 99) {
        this.width = width;
        this.height = height;
        this.mines = Math.min(mines, width * height - Math.ceil(width * height / 10));
        this.field = this.generateField();
    }

    generateField() {
        let field = [];
        let minePositions = this.setMines(this.width, this.height, this.mines);

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let square = new Square(i, j, this.hasMine(minePositions, i, j));
                field.push(square);
            }
        }

        return field;
    }

    setMines() {
        let remainingMines = this.mines;
        let minePositions = [];

        while (remainingMines > 0) {
            let xPos = Math.floor(Math.random() * this.width);
            let yPos = Math.floor(Math.random() * this.height);
            if (!minePositions.some(e => e[0] === xPos && e[1] === yPos)) {
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
    constructor(column, row, hasMine, isVisible = false) {
        this.column = column;
        this.row = row;
        this.hasMine = hasMine;
        this.isVisible = isVisible;
    }
}

exports.MineField = MineField;
exports.Square = Square;