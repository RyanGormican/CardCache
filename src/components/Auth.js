import React, { useState, useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {Icon } from '@iconify/react';

export default function Auth() {
  let auth = getAuth();
  let googleProvider = new GoogleAuthProvider();
  let navigate = useNavigate();

  const signUp = () => {
    signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/drive/');
      } else {
        navigate('/');
      }
    });
  }, []);

  return (
<div className='auth-btn'>
 <div className="links">
        <a href="https://www.linkedin.com/in/ryangormican/">
          <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
        </a>
        <a href="https://github.com/RyanGormican/CardCache">
          <Icon icon="mdi:github" color="#e8eaea" width="60" />
        </a>
        <a href="https://ryangormicanportfoliohub.vercel.app/">
          <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
        </a>
      </div>
  <div className='folder-flap'></div>
    <div className='folder-strip'>
  <div className='loginstuff'>
    <h1>CardCache</h1>
    <GoogleButton onClick={signUp} />
  </div>
  </div>
</div>



  );
}
