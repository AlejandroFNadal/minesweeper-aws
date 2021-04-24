import React from 'react';

import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
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
import FlagIcon from '@material-ui/icons/Flag';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    drawer: {
        border: '1px solid',
        height: '100vh'
    },
    game: {
        display: 'flex',
        flexDirection: 'row'
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
    },
    rightContentBox: {
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        marginTop: '8px',
        textAlign: 'center',
        marginBottom:'10px'
    },
    gameInfo:{
        border:'1px solid',
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    }
}))


export default function GameBoard(parentState) {
    const classes = useStyles();
    const {register, formState, handleSubmit}= useForm()
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
                <Square obj={elem} id={gameData.id} gameUpdater={updateBoard} game={gameData}/>)}
        </div>
    }

    function updateBoard(prevState, currentState) {
        setGameData(currentState)
    }
    const startGame = async function (e) {
        console.log('info',e)
        let newGame = await fetch(config.local_back + '/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.get('token')
            },
            body: JSON.stringify({
                gameData: {
                    x: e.X,
                    y: e.Y,
                    nBombs: e.nBombs,
                    user: cookie.get('username')
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
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Box p={2} className={classes.drawer}>
                    <form onSubmit={handleSubmit(startGame)}>
                        <div>
                            <TextField {...register("X")} margin="normal" id="X" name="X" label="X" type="text" />
                            <TextField {...register("Y")} margin="normal" id="Y" name="Y" label="Y" type="text" />
                            <TextField {...register("nBombs")} margin="normal" id="nBombs" name="nBombs" label="Bombas" type="text" />
                            <button type="submit">Comenzar</button>
                        </div>

                    </form>
                </Box>
            </Grid>
            <Grid item xs={8} >
                <Box className={classes.rightContentBox}>
                    <Typography className={classes.title} variant="h4">
                        Minesweeper-AWS
                    </Typography>
                    <Box display='flex' justifyContent='center' >
                        <Box display='flex'   mr={3} pl={1}>
                            <Box className={classes.gameInfo}>
                            <FlagIcon />
                            </Box>
                            <Box className={classes.gameInfo} pr={1} >{gameData ? gameData.flags : 0}</Box>
                        </Box>
                        <Box display='flex'  pl={1}>
                            <Box className={classes.gameInfo}>
                            <Brightness5Icon />
                            </Box>
                            <Box className={classes.gameInfo} pr={1} height='100%'>{gameData ? gameData.nBombs : 0}</Box>
                        </Box>
                    </Box>
                    <Box className={classes.game} display='flex' justifyContent='center' pt={4}>
                        <ul>{showBoard && gameData?
                            gameData.board.map(elem => { return retornRow(elem) }) : null}
                        </ul>
                    </Box>
                    <Box display='flex' justifyContent='center pt={4}'>
                        {gameData.fullStatus === "won" ? <p>You Won!</p> : ""}
                        {gameData.fullStatus === "lost" ? <p>You Lose</p> : ""}
                    </Box>
                    <Box>
                        <Button onClick={()=>{parentState.setMenu()}}> Regresar</Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}