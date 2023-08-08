import React from 'react'
import { Icon } from '@iconify/react';
import {getStorage,ref, getDownloadURL} from "firebase/storage";
export default function Card() {
	const storage = getStorage();
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
      console.log('File available at', downloadURL);
    });
  }
)
	}
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