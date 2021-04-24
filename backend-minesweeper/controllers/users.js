const AWS = require('aws-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken')
 , LocalStrategy = require('passport-local').Strategy

var bcrypt = require('bcrypt-nodejs')
const IS_OFFLINE = process.env.NODE_ENV !== 'production';
if(IS_OFFLINE){
    console.log("running offline")
    require('dotenv').config()
}
const comparePassword = function(passw, foundPass,cb){
    bcrypt.compare(passw,foundPass, function(err,isMatch){
        if(err){
            return cb(err);
        }
        cb(null,isMatch)
    })
};
const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

var getToken = function(headers){
    if(headers && headers.authorization){
        var parted = headers.authorization.split(' ');
        if(parted.length === 2){
            return parted[1];
        }
        else{
            return null;
        }
    } else{
        return null;
    }
};
exports.signUp = async function(req,res,next){
    let user = req.body;
    bcrypt.genSalt(10, function(err,salt){
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password, salt, null, function(err,hash){
            if(err){
                return next(err);
            }
            console.log(hash)
            let password = hash;
            const username = user.username;
            const params = {
                TableName:'users',
                Item:{
                    username,
                    password
                }
            }
            dynamoDb.put(params,(error,result)=>{
                if(error){
                    res.status(400).send(error);
                }
                else{
                    res.statusCode=201;
                    res.json({message:"Success in signing user up"})
                }
                
            })
        });
    });
    
}

exports.login = async function(req,res,next){
    let user = req.body;
    const params ={
        TableName: 'users',
        KeyConditionExpression:"#username = :username",
        ExpressionAttributeNames:{
            "#username": "username"
        },
        ExpressionAttributeValues:{
            ':username': req.body.username
        }
    }
    
    let result = await dynamoDb.query(params).promise()
    
    if(result.Items){
        console.log(result)
        let userData = result.Items[0];
        comparePassword(req.body.password,userData.password, async function(err,isMatch){
            if(isMatch && !err){
                user.password = result.Items[0].password
                let token = jwt.sign(user, process.env.JWTSECRET,{expiresIn:'6h'});
                res.statusCode =200;
                res.json({message:"correct login", token:'JWT '+token, lastGameId:userData.lastGame});
            }
            else{
                next(new Error("invalid credentials"));
            }
        })
    }else{
        res.status(401).json({message:"invalid credentials"})
    }
}
exports.userGetGame = async function(req, res,next){
    try{
        let user = req.query.user;
        
        const params ={
            TableName: 'users',
            Key:{
                username:user
            }
        }
        let result = await dynamoDb.get(params).promise();
        if(!result.Item){
            res.status(404).json({error:"user not found"})
            return ;
        }

        const getUserGameParams = {
            TableName: 'games',
            Key: {
                id:result.Item.lastGame
            }
        };
        let gameOfUser = await dynamoDb.get(getUserGameParams).promise()
        if(gameOfUser.Item){
            res.json(gameOfUser.Item);
        }
        else{
            res.status(400).json({ error: 'Error retrieving Game' });
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error:error})
    }
}