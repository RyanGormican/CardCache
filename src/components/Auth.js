import React, { useState, useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  let auth = getAuth();
  let googleProvider = new GoogleAuthProvider();
  let navigate = useNavigate();

  const signUpAnonymously = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        // Handle successful anonymous sign-up if needed
      })
      .catch((error) => {
        // Handle errors if needed
        console.error('Error signing up anonymously:', error);
      });
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const user = userCredential.user;
        // Handle successful Google sign-up if needed
      })
      .catch((error) => {
        // Handle errors if needed
        console.error('Error signing up with Google:', error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user is anonymous
        if (user.isAnonymous) {
          // Handle anonymous user
          navigate('/drive/');
        } else {
          // Handle authenticated user
          navigate('/drive/');
        }
      } else {
        navigate('/');
      }
    });
  }, []);

  return (
    <div className='auth-btn'>
      <h1>CardCache</h1>
      <GoogleButton onClick={signUpWithGoogle} />
      <button onClick={signUpAnonymously}>Anonymous(Testing)</button>
    </div>
  );
}
