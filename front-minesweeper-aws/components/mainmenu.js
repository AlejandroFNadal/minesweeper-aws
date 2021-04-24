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
import GameBoard from './game'
import GameBoardContinue from './continuation';


const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  button:{
    height:'3rem',
    textAlign:'center',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
  }
}));


export default function MainMenu() {

  const [menu,setMenu] = React.useState(true)
  const [continuation, setContinuation] = React.useState(false)
  const classes = useStyles();
  console.log(menu)
  const startNewGame=(e)=>{
      setMenu(false);
  }
  const continueLastGame=(e)=>{
    setContinuation(true);
    
  }
  const goBackToMenu=(e)=>{
    setMenu(true);
    setContinuation(false);
  }
  return (
    <React.Fragment>
      <CssBaseline />
      {menu && !continuation ? (<>
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Minesweeper-AWS
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
            Hecho por Alejandro Nadal para el desafio de TAP. Utiliza AWS Lambda, S3, ApiGateway, escrito en React/Node.
            </Typography>
        </Container>)
        
        <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">
                <Grid item xs={6} onClick={continueLastGame}>
                    <Paper className={classes.button}>
                        Continuar Juego
                    </Paper>
                </Grid>
                <Grid item xs={6} onClick={startNewGame}>
                    <Paper className={classes.button}>
                        Nuevo Juego
                    </Paper>
                </Grid>
            </Grid>
        
        </Container>
      </>) :(!continuation && !menu?(
          <GameBoard setMenu={goBackToMenu}/>
      ):<GameBoardContinue setMenu={goBackToMenu}/>)
      }
     
    </React.Fragment>
  );
}
