const Cell = class{
    constructor(x,y, type, status){
        this.x=x;
        this.y=y;
        this.type=type;
        this.status='tiled';
        this.neighborBombs = 0;
    }
    turnIntoBomb(){
        this.type='bomb'
    }
}

module.exports = Cell