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

exports.addMove = function(req,res,next){
    try{
        
    }catch(error){
        console.log(error);
        return ;
    }
}