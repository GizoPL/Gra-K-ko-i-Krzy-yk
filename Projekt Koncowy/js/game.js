const StatusCodes = {
  INVALID: 0,
  VALID: 1,
  DRAW: null,
  PLAYER1WIN: true,
  PLAYER2WIN: false,
  COMPLETE: -1
}

const GameModel = {
  board: [],
  boardID: [],
  player: true, 
  turnCount: 0,
  moves: [],
  status: StatusCodes.VALID,
  score: [0, 0],
  winAxis: null,

  processMove: function (pos) {
    if (this.status === StatusCodes.INVALID || this.status === StatusCodes.VALID) {

      let coords = this.validateMove(pos);

      if (!coords) { 
        return this.status = StatusCodes.INVALID;
      }

      this.moves.push([this.player, ...coords]);
      this.board[coords[0]][coords[1]] = this.player; 
      let [result, axis] = this.checkIfGameIsOver();
      this.winAxis = axis;

      if (result === null) {
        this.turnCount++

        if (this.turnCount === this.board.length ** 2) {
          return this.status = StatusCodes.DRAW;
        }

        this.player = !this.player 
        return this.status = StatusCodes.VALID;
      } else { 
        result ? this.score[0]++ : this.score[1]++;
        return this.status = result;
      }
    } else {
      return this.status = StatusCodes.COMPLETE;
    }
  },

  validateMove: function (pos) {
    let coords = this.getSquare(pos);
    let square = this.board[coords[0]][coords[1]];
    return square === true || square === false ? false : coords;

  },

  checkIfGameIsOver: function () {
    return this.checkGameAxes(this.getGameAxesAsRows(this.board));
  },

  getGameAxesAsRows: function (matrix) {
    return [...matrix, ...this.transpose(matrix), ...this.getDiagonalAxes(matrix)];
  },

  checkGameAxes: function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      let winner = this.checkAxis(matrix[i]);
      if (winner !== null) {
        return [winner, i];
      }
    }
    return [null, null];
  },

  checkAxis: function (row) {
    for (let i = 0; i < 5; i++) {
      if (row[i] === row[i + 1] && row[i + 1] === row[i + 2] && row[i + 2] === row[i + 3] && row[i + 3] === row[i + 4]) {
        return row[i];
      }
    }
    return null;
  },

  transpose: (matrix) => matrix[0].map((_, i) => matrix.map(x => x[i])),

  getDiagonalAxes: function (matrix) {
    let diagonals = [[], []];
    for (let i = 0; i < matrix.length; i++) {
      diagonals[0].push(matrix[i][i]);
      diagonals[1].push(matrix[i][matrix[0].length - 1 - i]);
    }
    return diagonals;
  },

  getSquare: function (pos) {
    let side = this.board[0].length;
    let multiplier = Math.floor(pos / side);
    return [multiplier, pos - side * multiplier];
  },

  copyNestedArray: (arr) => arr.map(x => x.slice()),

  createBoard: function (side) {
    let count = 0;
    return [...Array(side)].map((_, i) => {
      let row = [];
      for (let j = 0; j < side; j++) {
        row.push(side * i + count);
        count++
      }
      count = 0;
      return row;
    });
  },

  reset: function () {
    this.turnCount = 0;
    this.player = true;
    this.status = 1;
    this.moves = [];
    this.winAxis = null;
    this.board = this.createBoard(10);
    this.boardID = this.copyNestedArray(this.getGameAxesAsRows(this.board));
  },

  resetScore: function () {
    this.score = [0, 0];
  },

  resetGame: function () {
    this.turnCount = 0;
    this.player = true;
    this.status = 1;
    this.moves = [];
    this.winAxis = null;
    this.board = this.createBoard(10);
    this.resetScore();
  }

};
