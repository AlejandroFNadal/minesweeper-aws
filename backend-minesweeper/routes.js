const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');
const { routes } = require('./app');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const GAMES_TABLE = 'games';
const passport = require('passport')
require('./config/passport')(passport)

const gamesController = require('./controllers/games');
const usersController = require('./controllers/users');
const movesController = require('./controllers/moves');


const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();
const router = express.Router();

router.get('/games',  passport.authenticate('jwt', {failWithError:true, session:false}),gamesController.getAllGames);
router.get('/games/:id', passport.authenticate('jwt', {failWithError:true, session:false}),gamesController.getGame);
router.post('/games', passport.authenticate('jwt', {failWithError:true, session:false}), gamesController.createGame);


router.delete('/games/:id', passport.authenticate('jwt', {failWithError:true, session:false}), gamesController.deleteGame);

router.post('/signup',usersController.signUp);
router.post('/login', usersController.login)

router.post('/move', passport.authenticate('jwt', {failWithError:true, session:false}), movesController.addMove)
router.get('/game', passport.authenticate('jwt', {failWithError:true, session:false}), usersController.userGetGame)

module.exports = router;
