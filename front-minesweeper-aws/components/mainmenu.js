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


const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));


export default function MainMenu() {

  const [menu,setMenu] = React.useState('true')
  const classes = useStyles();
  console.log(menu)
  const startNewGame=(e)=>{
      setMenu(false);
  }
  return (
    <React.Fragment>
      <CssBaseline />
      {menu ? (<>
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
                <Grid item xs={6} >
                    <Paper>
                        Continuar Juego
                    </Paper>
                </Grid>
                <Grid item xs={6} onClick={startNewGame}>
                    <Paper>
                        Nuevo Juego
                    </Paper>
                </Grid>
            </Grid>
        
        </Container>
      </>) :(
          <GameBoard/>
      )}
     
    </React.Fragment>
  );
}
