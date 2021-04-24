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

exports.createGame = async function(req,res,next){
    
    try{
        res.setHeader('content-type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        const{x,y,nBombs, user} = req.body.gameData;
        let aGame=undefined;
        try{
            aGame = new Game(x,y,nBombs)
        } catch(error){
            console.log(error);
            return error;

        }
        
        const id = uuid.v4();
        let board = aGame.board;
        let fullStatus = aGame.fullStatus;
        let flags = aGame.flags;
        let textBoardNotTiled = aGame.textBoardNotTiled()
        const params = {
            TableName: 'games',
            Item: {
                id,
                x,
                y,
                nBombs,
                board,
                fullStatus,
                flags
            },
        };
        
        dynamoDb.put(params, async (error) => {
            if (error) {
                res.status(400).send(error);
                return ;
            }
            const userParams ={
                TableName: 'users',
                Key:{
                    username: user
                },
                UpdateExpression:"set lastGame = :idGame",
                ExpressionAttributeValues:{
                    ':idGame': id
                }
            }
            let result = await dynamoDb.update(userParams).promise()
            res.json(
                {id,...aGame}
            );
        });
    } catch(error){
        console.log(error);

    }
}

exports.getGame = async function(req,res,next){
    const id = req.params.id;
    const params = {
        TableName: 'games',
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving Game' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Game with id: ${id} not found` });
        }
    });
}

exports.getAllGames = async function(req,res,next){
    const params = {
        TableName: 'games'
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the games' });
        }
        res.json(result.Items);
    });
}

exports.deleteGame = async function(req,res,next){
    const id = req.params.id;
    const params = {
        TableName: GAMES_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete Employee' });
        }
        res.json({ success: true });
    });
}