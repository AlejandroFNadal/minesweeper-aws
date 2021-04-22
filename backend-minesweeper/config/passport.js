
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt; 
require('dotenv').config()

const AWS = require('aws-sdk');
const uuid = require('uuid');
const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'sa-east-1',
        endpoint: 'http://localhost:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();


module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.JWTSECRET
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        dynamoDb.scan({TableName: 'users'},(error,result)=>{
            if(error){
                return done(err, false,{message: "invalid credentials"});
            }
            if(result){
                done(null, result);
            }
            else{
                done(null, false,{message: "invalid credentials"} ); 
            }
        })
        
    }))
}