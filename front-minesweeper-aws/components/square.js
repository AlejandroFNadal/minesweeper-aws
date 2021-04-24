import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import config from '../config/vars'
import cookie from 'js-cookie'
import FlagIcon from '@material-ui/icons/Flag';
import Brightness5Icon from '@material-ui/icons/Brightness5';

const useStyles = makeStyles((theme) => ({

    squares: {
        backgroundColor: 'green',
        width: '2em',
        height: '2em',
        border: '1px solid',
        fontSize:'1.5em',
        color:'white',
        textAlign:'center',
        verticalAlign:'center'
    },
    untiled:{
        backgroundColor:'lightgreen',
        width: '2em',
        height: '2em',
        border: '1px solid',
        textAlign:'center',
        verticalAlign:'center',
        fontSize:'1.5em',
        color:'white'
    },
    rows: {
        display: 'flex',
        flexDirection: 'row'

    }
}))


export default function Square(obj) {
    console.log('Props', obj)
    const classes = useStyles()
    let propObject = obj.obj;
    let [x, setX] = React.useState(propObject.x)
    let [y, sety] = React.useState(propObject.y)
    let [gameId, setGameId] = React.useState(obj.id)
    let gameUpdater = obj.gameUpdater;
    console.log(gameId)

    let moveCheck = async function(type){
        console.log("Inside moveCheck")
        let fetchString = `${config.local_back}/move?id=${gameId}&x=${x}&y=${y}&type=${type}`
        console.log(fetchString)
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
        //there is a proper response
        console.log(`Move in ${x} ${y}`)
    }
    
    return (
        <Box
            className={propObject.status === 'untiled' ? classes.untiled : classes.squares}
            onClick={() =>{moveCheck('check')}} onContextMenu={(e)=> {e.preventDefault(); moveCheck('flag')}}>
                {propObject.neighborBombs > 0 && propObject.status ==="untiled" ? propObject.neighborBombs :""}
                {propObject.type==="bomb" && propObject.status ==="untiled" ?
                <Brightness5Icon/>:""}
                {propObject.status ==="flag" ? <FlagIcon/>: ""}
        </Box>)
}
            
