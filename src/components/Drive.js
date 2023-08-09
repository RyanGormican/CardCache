import React, { useState, useEffect }  from 'react';
import { Icon } from '@iconify/react';
import {Modal, Input} from 'antd';
import {useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot} from 'firebase/firestore';
import { database } from '../firebaseConfig';

export default function Drive() {
let navigate = useNavigate();
const collectionRef = collection(database, 'cardData')
const [cardName, setCardName] = useState('');
const [cards, setCards]= useState ([]); 
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
	   		fileLink: [{
			downloadURL: '',
			fileName:  ''
			}]
	   })
	.then(() => {
		setIsModalVisible(false);
	})
	.catch(err =>{
		alert(err.message)
	});
			
	};

	const readData = () => {
		onSnapshot(collectionRef, (data) => {
			setCards(data.docs.map((doc) => { 
				return {...doc.data(), id: doc.id}
			}))
		})
	}
	const openCard = (id) => {
		navigate(`/card/${id}`)
	}
	useEffect(() => {
		readData();
	}, [])
	return(
		<div> 
			<div className='icon-container'>
				<Icon icon="material-symbols:folder" height="60" onClick={showModal} />
			</div> 

			<div className='grid-parent'>
				{cards.map((card) => {
					return (
						<div className='preview-child' onClick={()=> openCard(card.id)}>
							<h4>{card.cardName}</h4>
						</div> 
					)
				})}	
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
