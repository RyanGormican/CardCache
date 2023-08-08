import React from 'react'
import { Icon } from '@iconify/react';
import {getStorage,ref, getDownloadURL} from "firebase/storage";
export default function Card() {
	const getCard = (event) => {

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