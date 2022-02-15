const {MineField, Square} = require('./mines.js');

test('Verifies that the amount of mines set for a given field size does not exceed 90% of the total squares.', () => {
    expect(new MineField(10, 10, 2000).mines).toBe(90);
});

test('Verifies that the squares are created correctly.', () => {
    expect(new Square(0, 1, true)).toEqual({x: 0, y: 1, hasMine: true, isVisible: false});
});