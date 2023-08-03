import React from 'react'
import GoogleButton from 'react-google=button';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChange } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
	let auth = getAuth();
	let googleProvider= new GoogleAuthProvider();
	let navigate = useNavigate();

	const signUp = () => {
		signInWithPopup(auth, googleProvider)

	}

	useEffect(() => {
		onAuthStateChange(auth, (user) => {
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
		<h1> Sign In With Google... </h1>
		<GoogleButton
			onClick={signUp}
		/>
		</div>
	)
}