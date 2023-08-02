import React from 'react'
import { Icon } from '@iconify/react';
import {Modal} from 'antd';
export default function Drive() {
	return(
		<div> 
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" name="myfile" />
				</div> 
				<Icon icon="material-symbols:folder" />
			</div> 
		
		</div>
	)
}