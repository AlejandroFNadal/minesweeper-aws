import Head from 'next/head';
//import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import { GetApp } from '@material-ui/icons';
import Router from 'next/router';
import SignIn from './login'



import config from '../config/vars'
import MainMenu from '../components/mainmenu'

function Home() {
  let lastGameId = cookie.get('lastGameId');
  console.log("inside Home")
  console.log(lastGameId)
  useEffect(()=>{
    
  },[])
  const {data, revalidate} = useSWR(config.local_back+'/validate', async function() {
    try{
      const res = await fetch(`${config.local_back}/validate`,{
        method:'GET',
        headers:{
          'Authorization': cookie.get('token')
        }
      });
      return res.json();
    }catch(error){
      console.log(error);
      Router.push('/error')
    }
    
  });
  let loggedIn = false;
  if (!data) return <h1>Loading...</h1>;
  else if (data.message === "continue") {
    console.log(data)
    loggedIn = true;
  }
  else{
    Router.push('/login')
  }
  
  
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
       {/* {!loggedIn && (
        <SignIn/>
      )} */} 
    </div>
  );
}

export default Home;