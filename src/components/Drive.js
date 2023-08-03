import React, { useState }  from 'react'
import { Icon } from '@iconify/react';
import {Modal, Input} from 'antd';
import { collection, addDoc} from 'firebase/firestore';
export default function Drive() {
const collectionRef = collection(database, 'cardData')
const [folderName, setFolderName] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const folderUpload = () => {
	addDoc(collectionRef, {
	   folderName : folderName,
	   })
	.then( => {
		setIsModalVisible(false);
		alert('Card Added')
	})
	.catch(err =>{
		alert(err.message)
	})
	}
			
	};
	return(
		<div> 
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" />
					<input type="file" name="myfile" />
				</div> 
				<Icon icon="material-symbols:folder" onClick={showModal} />
			</div> 
			<Modal 
			title="Card Upload" 
			open={isModalVisible} 
			onOk={folderUpload} 
			onCancel = {handleCancel} 
			centered
			>
				<input placeholder="Enter the Card Name..." 
				onChange={(event)=> setFolderName(event.target.value)}
				/>
			</Modal>
		</div>
	)
}