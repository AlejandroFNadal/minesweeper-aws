import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import cookie from 'js-cookie'
//import { Router } from '@material-ui/icons';
import Router from 'next/router';
import React, {useState} from 'react'
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
import config from '../config/vars'





const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  help:{
    margin: theme.spacing(8, 2),
    color: theme.palette.primary.light
  }
}));

export default function SignIn() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  function handleSubmit(e){
    console.log("here")
    e.preventDefault();
    fetch(`${config.local_back}/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then((r) =>{
      return r.json();
    })
    .then((data)=>{
      console.log(data);
      if(data && data.token){
        cookie.set('token', data.token,{expires:2})
        cookie.set('lastGameId', data.lastGameId);
        cookie.set('username', username)
        Router.push('/')
      }
    })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div  className={classes.paper}>
        <Typography component="h1" variant="h4">
            Minesweeper-AWS
        </Typography>
        <br/>
        <Typography component="h1" variant="h5">
            Ingresa a tu cuenta
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
        </form>
        
      <Box>
        <Link href="/signup.html">Registrate</Link>
      </Box>
      </div>
      <Box mt={8}>
        
      </Box>
    </Container>
  );
}
