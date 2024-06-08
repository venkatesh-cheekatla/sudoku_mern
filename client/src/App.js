import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Game from './components/Game';
import Home from './components/Home';
import Landing from './components/Landing';
import Auth from './components/Auth/Auth';
import User from './components/UserProfile';
import Controller from './components/Controller';

const App = () => {
  const [email, setEmail] = useState(''); // Define email state
  const [password, setPassword] = useState(''); // Define password state

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('https://sudoku-mern-api.vercel.app/register', { email, password })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Controller />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/game" element={<Game />} />
          <Route path="/myprofile" element={<User />} />
          {/* <Route path="/user/:username" element={<User />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
