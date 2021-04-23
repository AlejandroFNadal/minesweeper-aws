const Cell = require('./cell');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


const Game = class {
    constructor(x, y, nBombs, possibleBoard, possiblefullStatus) {

        console.log("Game Constructor")
        console.log(x, " ", y, " ", nBombs)
        this.x = x;
        this.y = y;
        this.nBombs = nBombs;
        this.board = []
        if (possiblefullStatus) {
            this.fullStatus=possiblefullStatus
        }
        else{
            this.fullStatus = 'active';
        }
        if (x * y < nBombs) {
            throw new Error("too many bombs")
            return;
        }
        //creation of board
        if (possibleBoard) {
            this.board = possibleBoard;
        }
        else {
            console.log("Creating Board from scratch")
            for (let i = 0; i < x; i++) {
                let tempRow = []
                for (let j = 0; j < y; j++) {
                    tempRow.push(new Cell(i, j, 'empty', 'tiled'))
                }
                this.board.push(tempRow);
            }
            let bombPos = []
            console.log(this.board)
            //create positions of bombs
            while (bombPos.length < nBombs) {
                let tempx = getRndInteger(0, this.x - 1)
                let tempy = getRndInteger(0, this.y - 1)

                var pair = [tempx, tempy]
                if (!(bombPos.includes(pair))) {
                    bombPos.push(pair)
                    console.log(tempx, " ", tempy)
                    console.log(this.board[tempx])
                    this.board[tempx][tempy].turnIntoBomb()
                }
            }
            //now we measure how many bombs around each block has. I am going to use a very non efective method here
            //if I have time, or perhaps after the challenge, I will make this go faster
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    if (this.board[i][j].type == "empty") {
                        //I am going to generalize and except corner and side cases
                        //counting bombs above the cell
                        for (let k = (j - 1); k <= (j + 1); k++) {
                            if (k >= 0 && k < this.y && i != 0) {
                                if (this.board[i - 1][k].type == 'bomb') {
                                    this.board[i][j].neighborBombs++;
                                }
                            }
                            //below now
                            if (k >= 0 && k < this.y && i < this.x - 1) {
                                if (this.board[i + 1][k].type == 'bomb') {
                                    this.board[i][j].neighborBombs++;
                                }
                            }
                        }
                        //now, the horizontal sides
                        if (j - 1 >= 0 && this.board[i][j - 1].type == 'bomb') {
                            this.board[i][j].neighborBombs++
                        }
                        if (j + 1 < this.y && this.board[i][j + 1].type == 'bomb') {
                            this.board[i][j].neighborBombs++
                        }
                    }
                }
            }
        }

    }
    textBoardNotTiled() {
        let stringBoard = "";
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.board[i][j].type == 'bomb') {
                    stringBoard = stringBoard + "X "
                }
                if (this.board[i][j].type == 'empty') {
                    stringBoard = stringBoard + this.board[i][j].neighborBombs + " "
                }
            }
            stringBoard = stringBoard + "\n"
        }
        console.log("Inside textBoardNotTiled, ", stringBoard)
        return stringBoard;
    }
    textBoardTiled() {
        let stringBoard = "";
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.board[i][j].status == 'tiled') {
                    stringBoard = stringBoard + "| O "
                }
                else if (this.board[i][j].type == 'bomb') {
                    stringBoard = stringBoard + "| X "
                }
                else if (this.board[i][j].status == 'flag') {
                    stringBoard = stringBoard + "| F "
                }
                else if (this.board[i][j].type == 'empty' && this.board[i][j].neighborBombs > 0) {
                    stringBoard = stringBoard +"| " +this.board[i][j].neighborBombs + " "
                }
                else {
                    stringBoard = stringBoard + "|   "
                }
            }
            stringBoard = stringBoard + "|\n"
        }
        console.log("Inside textBoardNotTiled, ", stringBoard)
        return stringBoard;
    }
    endGame() {
        this.fullStatus = "ended"
    }
}
module.exports = Game;