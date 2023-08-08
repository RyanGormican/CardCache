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
		.catch((error)> {


		}
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