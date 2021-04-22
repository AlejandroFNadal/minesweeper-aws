const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');
const Game = require('../classes/game');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

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
        console.log("here")
        let result = await dynamoDb.get(params).promise()
        console.log(result)
        if (!result.Item) {
            res.status(404).json({ error: `Game with id: ${id} not found` });
            return;
        }

        let fullGame = result.Item;
        objGame = new Game(fullGame.x, fullGame.y, fullGame.nBombs, fullGame.board, fullGame.fullStatus)
        //check later for move outside board

        if (type == "check" && fullGame.board[x][y].type == "bomb") {
            objGame.endGame()
        }
        console.log(objGame.fullStatus)
        //update object
        let gameUpdate = dynamoDb.update({
            TableName:"games",
            Key:{
                id:id
            },
            UpdateExpression: "set fullStatus = :status",
            ExpressionAttributeValues:{
                ":status" : objGame.fullStatus
            }
        }).promise();
        if(gameUpdate){
            console.log(gameUpdate);
            console.log(objGame.textBoardNotTiled)
            res.json({message:"Success with move"})
        }

    } catch (error) {
        console.log(error);
        return;
    }
}