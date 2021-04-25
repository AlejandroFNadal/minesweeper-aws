import Head from 'next/head';
//import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import { GetApp } from '@material-ui/icons';
import Router from 'next/router';
import SignIn from './login'
import React, { useEffect } from 'react';



import config from '../config/vars'
import MainMenu from '../components/mainmenu'

function Home() {
  let lastGameId = cookie.get('lastGameId');
  let data = undefined
  const [loggedIn, setLoggedIn] = React.useState()
  
  useEffect(async ()=>{
    try{
      const res = await fetch(`${config.local_back}/validate`,{
        method:'GET',
        headers:{
          'Authorization': cookie.get('token')
        }
      });
      if(res.status === 401){
        Router.push('/login')
      }
      data = await res.json();
      if (!data) return <h1>Loading...</h1>;
      else if (data.message === "continue") {
        setLoggedIn(true)
        //loggedIn = true;
      }
      else{
        Router.push('/login')
      }
    }catch(error){
      console.log(error);
      Router.push('/login')
    }
  },[])
  
  
  
  
  return (
    <div>
      <Head>
        <title>Main Menu</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {loggedIn && (
        <>
          <MainMenu/>
        </>
      )}
    </div>
  );
}

export default Home;