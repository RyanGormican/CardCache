import React from 'react'
import { Icon } from '@iconify/react';
import {getStorage,ref, getDownloadURL} from "firebase/storage";
export default function Card() {
	const storage = getStorage();
	const getCard = (event) => {
	const cardRef = ref(storage, event.target.files[0].name);
	getDownloadURL(cardRef)
		.then((url) = > {

		})
		  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });

	}
	return (
		<div> 
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" onChange={getCard} name="myfile" />
				</div> 
			</div> 
		
		</div>
	)
}