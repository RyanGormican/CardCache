import React from 'react'
import GoogleButton from 'react-google=button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
export default function Auth() {
	let auth = getAuth();
	let googleProvider= new GoogleAuthProvider();

	const signUp = () => {
		signInWithPopup(auth, googleProvider)

	}
	return (
		<div className='auth-btn'>
		<h1> Sign In With Google... </h1>
		<GoogleButton
			onClick={signUp}
		/>
		</div>
	)
}