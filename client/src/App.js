import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Game from './components/Game'
import Home from './components/Home'

import Landing from './components/Landing'
import Auth from './components/Auth/Auth'
import User from './components/UserProfile'
import Controller from './components/Controller'

const App = () => {
  
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize',  () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`); 
  })
  axios.default.withCredentials=true;
  const handleSubmit=(e)=>{
    e.preventDefault();
    axios.post('https://sudoku-mern-api.vercel.app/register',{email,password})
    .then(result=>console.log(result))
    .catch(err=>console.log(err))
    
  }
  return (
    <>
        <BrowserRouter>
          {/* <Navbar /> */}
          <Controller />
          <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="/home" element={<Home />}></Route>
            
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/game" element={<Game />}></Route>
            <Route path="/myprofile" element={<User />} />
            {/* <Route path="/user/:username" element={<User />}></Route> */}
          </Routes>

    

        </BrowserRouter>

    </>
  );
}

export default App;
