import React, { useState }  from 'react'
import { Icon } from '@iconify/react';
import {Modal} from 'antd';

export default function Drive() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
	};
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