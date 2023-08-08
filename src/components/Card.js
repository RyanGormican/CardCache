import React, {useState, useEffect} from 'react'
import { Icon } from '@iconify/react';
import { useParams, useNavigate} from 'react-router-dom'
import {getStorage,ref, getDownloadURL} from "firebase/storage";
import {updateDoc, doc, onSnapshot, collection } from 'firebase/firestore'
export default function Card(
{
database
) {
let params=useParams();
let navigate = useNavigate();
const [cards, setCards]= useState ([{
downloadURL: '',
fileName: ''
}]); 
const [cardName, setCardName]= useState (''); 
	const storage = getStorage();
	const databaseRef = doc(database, 'cardData', params?.id)
	const getFile = (event) => {
	const fileRef = ref(storage, event.target.files[0].name);
	const uploadTask = uploadBytesResumable(fileRef, file);
	uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
		updateDoc(databaseRef,{
			fileLink: [...cards, {
			downloadURL: downloadURL,
			fileName:  event.target.files[0].name
			}]
		})
    });
  }
)
	}

		const readData = () => {
		onSnapshot(databaseRef, (data) => {
			setCards(doc.data().fileLink)
			setCardName(doc.data().cardName)
			})
	}
	const openFile = (downloadURL) => {
		window.open(downloadURL, '_blank');
	} 

	const goHome = () => {
		navigate('/drive')
	}
	useEffect(() => {
		readData();
	}, [])
	return (
		<div> 
			<div className= 'return' onClick= {goHome}>
			<Icon icon="icon-park-outline:return" height="60" />
			</div>
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" onChange={getFile} name="myfile" />
				</div> 
			</div> 
			<div className='folder-title'>
			<h1>{Cards.cardName} </h1>
			</div>
			<div className= 'grid-parent'>
				{cards?.map((card)=> {
					return (
					<>
						{card ? (
						
						<div className='grid-child' onClick={()=> openFile(card.downloadURL)}>
							<h5>{card.fileName} </h4>
						</div> 
						) : (
						""
						)}
					</>
						

					)
				})}
			</div> 
		</div>
	)
}