import React, { useState }  from 'react'
import { Icon } from '@iconify/react';
import {Modal, Input} from 'antd';
import { collection, addDoc, onSnapshot} from 'firebase/firestore';
export default function Drive() {
const collectionRef = collection(database, 'cardData')
const [cardName, setCardName] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const cardUpload = () => {
	addDoc(collectionRef, {
	   cardName : cardName,
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
			onOk={cardUpload} 
			onCancel = {handleCancel} 
			centered
			>
				<input placeholder="Enter the Card Name..." 
				onChange={(event)=> setCardName(event.target.value)}
				value={cardName}
				/>
			</Modal>
		</div>
	)
}