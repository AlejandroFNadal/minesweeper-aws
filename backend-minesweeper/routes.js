const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');
const { routes } = require('./app');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const GAMES_TABLE = 'games';

const gamesController = require('./controllers/games');
const usersController = require('./controllers/users')


const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();
const router = express.Router();
router.get('/games', (req, res) => {
    const params = {
        TableName: GAMES_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the games' });
        }
        res.json(result.Items);
    });
});
router.get('/games/:id', (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: GAMES_TABLE,
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
});
router.post('/games', gamesController.createGame);


router.delete('/games/:id', (req, res) => {
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
});
router.put('/employees', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const params = {
        TableName: EMPLOYEES_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        ReturnValues: "ALL_NEW"
    }
    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update Game' });
        }
        res.json(result.Attributes);
    })
});

router.post('/signup',usersController.adminSignUp);
router.post('/login', usersController.adminLogin)
module.exports = router;
