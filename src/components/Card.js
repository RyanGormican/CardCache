import React from 'react'
import { Icon } from '@iconify/react';
export default function Card() {
	return (
		<div> 
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" name="myfile" />
				</div> 
			</div> 
		
		</div>
	)
}