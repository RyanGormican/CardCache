import React from 'react'
import { Icon } from '@iconify/react';
export default function Drive() {
	return(
		<div> 
			<div className='icon-container'>
				<Icon icon="mdi:file-document-add-outline" />
				<div class="upload-btn">
					<button class ="btn"> Upload a file </button>
					<input type="file" name="myfile" />
				</div> 
				<Icon icon="material-symbols:folder" />
			</div> 
		
		</div>
	)
}