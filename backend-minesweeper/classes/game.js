const Cell = require('./cell')

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const Game = class{
    constructor(x,y,nBombs){
        console.log("Game Constructor")
        console.log(x," ",y," ", nBombs)
        this.x = x;
        this.y = y;
        this.nBombs = nBombs;
        this.board =[]
        this.fullStatus='active';
        
        if(x*y < nBombs){
            throw new Error("too many bombs")
            return ;
        }
        //creation of board
        for(let i =0;i<x;i++){
            let tempRow =[]
            for(let j = 0; j < y; j++){
                tempRow.push(new Cell(i,j,'empty','tiled'))
            }
            this.board.push(tempRow);
        }
        let bombPos=[]
        console.log(this.board)
        //create positions of bombs
        while(bombPos.length < nBombs){
            let tempx=getRndInteger(0,this.x-1)
            let tempy=getRndInteger(0,this.y-1)
            
            var pair =[tempx,tempy]
            if(!(bombPos.includes(pair))){
                bombPos.push(pair)
                console.log(tempx," ", tempy)
                console.log(this.board[tempx])
                this.board[tempx][tempy].turnIntoBomb()
            }
        }
        //now we measure how many bombs around each block has. I am going to use a very non efective method here
        //if I have time, or perhaps after the challenge, I will make this go faster
        for(let i =0; i < this.x;i++){
            for(let j = 0; j < this.y; j++){
                if(this.board[i][j].type == "empty"){
                    //I am going to generalize and except corner and side cases
                    //counting bombs above the cell
                    for(let k = (j-1); k < j+1; k++){
                        if(k >= 0 && k < this.y && i != 0){ 
                            if(this.board[i-1][k].type == 'bomb'){
                                this.board[i][j].neighborBombs++;
                            }
                        }
                    }
                    //checking below the cell
                    for(let k = (j+1); k < j+1; k++){
                        if(k >= 0 && k < this.y && i < this.x -1){
                            if(board[i+1][k].type == 'bomb'){
                                board[i][j].neighborBombs++;
                            }
                        }
                    }
                    //now, the horizontal sides
                    if(j-1 >= 0 && this.board[i][j-1].type == 'bomb'){
                        this.board[i][j].neighborBombs++
                    }
                    if(j+1 < this.y -1 && this.board[i][j+1].type == 'bomb'){
                        this.board[i][j].neighborBombs++
                    }
                }
            }
        } 
    }
    textBoard(){
        let stringBoard="";
        
    }
}
module.exports = Game;