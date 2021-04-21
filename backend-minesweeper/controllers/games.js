const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');
const Game = require('../classes/game');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const GAMES_TABLE = 'games';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

exports.createGame = async function(req,res,next){
    
    try{
        
        const{x,y,nBombs} = req.body.gameData;
        let aGame=undefined;
        try{
            aGame = new Game(x,y,nBombs)
        } catch(error){
            console.log(error);
            return error;

        }
        const id = uuid.v4();
        let board = aGame.board;
        const params = {
            TableName: GAMES_TABLE,
            Item: {
                id,
                x,
                y,
                nBombs,
                board
            },
        };
        dynamoDb.put(params, (error) => {
            if (error) {
                res.status(400).send(error);
            }
            res.json({
                message:"Sucess in creating game"
            });
        });
    } catch(error){
        console.log(error);

    }
}

