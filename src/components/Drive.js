import React, { useState, useEffect }  from 'react';
import { Icon } from '@iconify/react';
import {Modal, Input} from 'antd';
import {useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, where} from 'firebase/firestore';
import { database} from '../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';

export default function Drive() {
let navigate = useNavigate();
let auth = getAuth();
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
  const user = auth.currentUser;
  
  if (collectionRef && user) {
    addDoc(collectionRef, {
      userId: user.uid, // Attach the user ID to each card
      cardName: cardName,
      fileLink: [{
        downloadURL: '',
        fileName: ''
      }]
    })
      .then(() => {
        setIsModalVisible(false);
      })
      .catch(err => {
        alert(err.message);
      });
  }
};


const readData = () => {
  const user = auth.currentUser;

  if (collectionRef && user) {
    const q = query(collectionRef, where('userId', '==', user.uid));

    onSnapshot(q, (data) => {
      setCards(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })));
    });
  }
};



	const handleLogout = () => {
    signOut(auth)
	};
	const openCard = (id) => {
		navigate(`/card/${id}`)
	}
	useEffect(() => {
		readData();
	}, [])
	return(
		<div>
			<div className='icon-logout'>
				<Icon icon="material-symbols:logout" height="60" onClick={handleLogout} />
			</div> 
			<div className='title'>
				<h1> CardCache </h1>
			</div>
			<div className='links'>
				<a href="https://www.linkedin.com/in/ryangormican/">
					<Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
				</a>
				<a href="https://github.com/RyanGormican/CardCache">
					<Icon icon="mdi:github" color="#e8eaea" width="60" />
				</a>
				<a href="https://ryangormicanportfoliohub.vercel.app/">
					<Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
				</a>
			</div>
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
			title="Add a Card" 
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
