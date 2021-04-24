import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import config from '../config/vars'
import cookie from 'js-cookie'
import FlagIcon from '@material-ui/icons/Flag';
import Brightness5Icon from '@material-ui/icons/Brightness5';

const useStyles = makeStyles((theme) => ({

    squares: {
        backgroundColor: 'red',
        width: '1rem',
        height: '1rem',
        border: '1px solid',
        
    },
    untiled:{
        backgroundColor:'blue',
        width: '1rem',
        height: '1rem',
        border: '1px solid',
        textAlign:'center',
        verticalAlign:'center'
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

    let moveCheck = async function(){
        console.log("Inside moveCheck")
        let fetchString = `${config.local_back}/move?id=${gameId}&x=${x}&y=${y}&type=check`
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
            onClick={moveCheck}>
                {propObject.neighborBombs > 0 && propObject.status ==="untiled" ? propObject.neighborBombs :""}
                {propObject.type==="bomb" && propObject.status ==="untiled" ?
                <Brightness5Icon/>:""}
        </Box>)
}
            
