import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper'
import { Router } from 'next/router';
import Drawer from '@material-ui/core/Drawer'
import config from '../config/vars'
import cookie from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Square from './square';

const useStyles = makeStyles((theme) => ({
    leftDrawer: {
        display: 'flex',
        flexWrap: true,
        width: '12rem',
        padding: '1rem',
        '& .MuiBackdrop-root': {
            position: 'absolute'
        },
    },
    rightSection: {
        '& .MuiBackdrop-root': {
            position: 'absolute'
        },
        marginLeft: '13rem'
    },
    squares: {
        backgroundColor: 'red',
        width: '1rem',
        height: '1rem',
        border: '1px solid'
    },
    rows: {
        display: 'flex',
        flexDirection: 'row'

    }
}))


export default function GameBoard() {
    const classes = useStyles();
    let [x, setX] = React.useState(0)
    let [y, sety] = React.useState(0)
    let [nBombs, setNBombs] = React.useState(0)
    let [showBoard, setshowBoard] = React.useState(false);
    let [gameData, setGameData] = React.useState({});
    let [flags, setFlags] = React.useState(0)

    function handleShowBoard() {
        setshowBoard(true)
    }

    function retornRow(row) {
        return <div className={classes.rows}>
            {row.map((elem) =>
                <Square obj={elem} id={gameData.id} gameUpdater={updateBoard}/>)}
        </div>
    }

    function updateBoard(prevState, currentState) {
        setGameData(currentState)
    }
    const startGame = async function (e) {
        e.preventDefault()
        let newGame = await fetch(config.local_back + '/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token')
            },
            body: JSON.stringify({
                gameData: {
                    x: 4,
                    y: 4,
                    nBombs: 4,
                    user: "Ale"
                }
            })
        })
        const game = await newGame.json()
        updateBoard(gameData, game)
        console.log(gameData)
        handleShowBoard();
        console.log("showBoard ", showBoard)
        
    }
    return (
        <div className={classes.leftDrawer}>
            <Drawer className={classes.leftDrawer} anchor="left" open={true}>
                <form className={classes.leftDrawer} onSubmit={startGame}>
                    <div>
                        <TextField margin="normal" id="X" name="X" label="X" type="text" />
                        <TextField margin="normal" id="Y" name="Y" label="Y" type="text" />
                        <TextField margin="normal" id="nBombs" name="nBombs" label="Bombas" type="text" />
                        <button type="submit">Comenzar</button>
                    </div>

                </form>
            </Drawer>
            <Box className={classes.rightSection}>
                <ul>{showBoard ?
                    gameData.board.map(elem => 
                 { return retornRow(elem) }) : null}
                </ul>
            </Box>

        </div>
    )
}