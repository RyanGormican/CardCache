import React, {useState, useEffect} from 'react';
import GoogleButton from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
	let auth = getAuth();
	let googleProvider= new GoogleAuthProvider();
	let navigate = useNavigate();

	const signUp = () => {
		signInWithPopup(auth, googleProvider)

	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user){
				navigate('/drive/')
			}
			else{
				navigate('/')
			}
		})
	}, [])
	return (
		<div className='auth-btn'>
		<div className='folder-flap'>
		<div className='folder'>
		<div className='loginstuff'>
		<h1> CardCache </h1>
		<GoogleButton
			onClick={signUp}
		/>
		</div>
		</div>
		</div>
		</div>
	)
}
