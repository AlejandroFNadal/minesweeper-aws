import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import config from '../config/vars'
import cookie from 'js-cookie'
import FlagIcon from '@material-ui/icons/Flag';
import Brightness5Icon from '@material-ui/icons/Brightness5';

let widthDyn = '2em';
let heightDyn = '2em';
const useStyles = makeStyles((theme) => ({

    squares: {
        backgroundColor: 'green',
        width: widthDyn,
        height: heightDyn,
        border: '1px solid',
        fontSize:'1em',
        color:'black',
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        alignContent:'space-around',
        justifyContent:'center',
    },
    untiled:{
        backgroundColor:'lightgrey',
        width: widthDyn,
        height: heightDyn,
        border: '1px solid',
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        alignContent:'space-around',
        justifyContent:'center',
        fontSize:'1em',
        color:'black',
    },
    rows: {
        display: 'flex',
        flexDirection: 'row'

    }
}))


export default function Square(obj) {
    const classes = useStyles()
    let propObject = obj.obj;
    let fullGame = obj.game;
    let [x, setX] = React.useState(propObject.x)
    let [y, sety] = React.useState(propObject.y)
    let [gameId, setGameId] = React.useState(obj.id)
    let gameUpdater = obj.gameUpdater;
    console.log(gameId)

    let moveCheck = async function(type){
        if(fullGame.fullStatus !== "active"){
            return ;
        }
        console.log("Inside moveCheck")
        let fetchString = `${config.local_back}/move?id=${gameId}&x=${x}&y=${y}&type=${type}`
        let moveAttempt = await fetch(fetchString,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token')
            }
        })
        let moveAttemptJ = await moveAttempt.json()
        console.log(moveAttemptJ)
        
        gameUpdater(null,moveAttemptJ.game)
        
        console.log(`Move in ${x} ${y}`)
    }
    
    return (
        <Box

            className={propObject.status === 'untiled' ? classes.untiled : classes.squares}
            onClick={() =>{moveCheck('check')}} onContextMenu={(e)=> {e.preventDefault(); moveCheck('flag')}}>
                {propObject.neighborBombs > 0 && propObject.status ==="untiled" ? propObject.neighborBombs :""}
                {propObject.type==="bomb" && propObject.status ==="untiled" ?
                <Brightness5Icon style={{height:"0.9rem", color:"red"}}/>:""}
                {propObject.status ==="flag" ? <FlagIcon style={{height:"0.9rem", color:"red"}}/>: ""}
        </Box>)
}
            
