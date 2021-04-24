const AWS = require('aws-sdk');
const express = require('express');
const { obj } = require('find-config');
const uuid = require('uuid');
const Game = require('../classes/game');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

    //recursively goes through in a depth first algoritm in a plus shape. 
function depthFirstPath(prevPositions, x, y, board, maxX, maxY){
    console.log(x," ",y)
    if(prevPositions.includes([x,y])){
        console.log("case 1")
        return ;
    }
    else if(x < 0 || y < 0 || x >= maxX || y >= maxY){
        console.log("case 2")
        return ;
    }
    else if(board[x][y].neighborBombs >0 && board[x][y].status=="tiled"){
        console.log("case 3")
        board[x][y].status="untiled"
        return ;
    }
    else if(board[x][y].neighborBombs == 0 && board[x][y].status=="tiled"){
        console.log("case 4")
        board[x][y].status="untiled";
        prevPositions.push([x,y]);
        depthFirstPath(prevPositions,x,y-1,board,maxX, maxY);
        depthFirstPath(prevPositions,x+1,y,board,maxX, maxY);
        depthFirstPath(prevPositions,x,y+1,board,maxX, maxY);
        depthFirstPath(prevPositions,x-1,y,board,maxX, maxY);
    }

}


function detectWin(board,x,y){
    let win = true;
    for(let i =0; i <x; i++){
        for(let j =0; j < y; j++){
            if(board[i][j].type == "bomb" && board[i][j].status!='flag'){
                win = false
            }
        }
    }
    return win;
}
exports.addMove = async function (req, res, next) {
    try {
        let { id, x, y, type } = req.query
        x = parseInt(x)
        y = parseInt(y)
        const params = {
            TableName: 'games',
            Key: {
                id:id
            }
        };
        let result = await dynamoDb.get(params).promise()
        if (!result.Item) {
            res.status(404).json({ error: `Game with id: ${id} not found` });
            return;
        }

        let fullGame = result.Item;
        objGame = new Game(fullGame.x, fullGame.y, fullGame.nBombs, fullGame.board, fullGame.fullStatus, fullGame.flags)
        if(objGame.fullStatus != "active"){
            res.status(200).json({error: 'Game has ended'})
            return ;
        }
        //check later for move outside board
        let currentCell = objGame.board[x][y]
        if (type == "check"){
            if(currentCell.type == "bomb") {
                objGame.board[x][y].status="untiled"
                objGame.endGame()
            }
            else{
                if(currentCell.type=="empty" && currentCell.status=="tiled" && currentCell.neighborBombs>0){
                    objGame.board[x][y].status="untiled"
                }
                else if(currentCell.type=="empty" && currentCell.status=="tiled" && currentCell.neighborBombs==0){
                    //recursive dynamic programming function called here
                    depthFirstPath([],x,y, fullGame.board, fullGame.x, fullGame.y);
                }
            }
        }
        if (type == "flag"){
            if(currentCell.status == "tiled"&& objGame.flags >0){
                objGame.board[x][y].status = 'flag'
                objGame.flags--
            }
            else if(currentCell.status == "flag"){
                objGame.board[x][y].status = "tiled"
                objGame.flags++
            }
        }
        if(detectWin(objGame.board,objGame.x, objGame.y)){
            objGame.endGame(true)
        }   
        
        console.log(objGame.fullStatus)
        //update object
        let gameUpdate = dynamoDb.update({
            TableName:"games",
            Key:{
                id:id
            },
            UpdateExpression: "set fullStatus = :status, board = :board, flags = :flags",
            ExpressionAttributeValues:{
                ":status" : objGame.fullStatus,
                ":board" : objGame.board,
                ":flags" : objGame.flags
            }
        }).promise();
        if(gameUpdate){
            console.log(gameUpdate);
            console.log(objGame.textBoardNotTiled())
            console.log("-------------------------------")
            console.log(objGame.textBoardTiled())
            res.json({message:"Success with move",
                    game: objGame})
        }

    } catch (error) {
        console.log(error);
        return;
    }
}