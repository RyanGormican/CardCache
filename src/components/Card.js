import React, {useState, useEffect} from 'react'
import { Icon } from '@iconify/react';
import { useParams} from 'react-router-dom'
import {getStorage,ref, getDownloadURL} from "firebase/storage";
import {updateDoc, doc, onSnapshot } from 'firebase/firestore'
export default function Card(
{
database
) {
let params=useParams();
const [cards, setCards]= useState ([]); 
	const storage = getStorage();
	const colectionRef = doc(database, 'cardData', params?.id)
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
		updateDoc(collectionRef,{
			fileLink: [downloadURL]
		})
    });
  }
)
	}

		const readData = () => {
		onSnapshot(collectionRef, (data) => {
			setCards(data.docs.map((doc) => { 
				return {...doc.data(), id: doc.id}
			}))
		})
	}
	useEffect(() => {
		readData();
	}, [])
	return (
		<div> 
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" onChange={getFile} name="myfile" />
				</div> 
			</div> 
		
		</div>
	)
}