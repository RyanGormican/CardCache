import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';

export default function Drive() {
  const navigate = useNavigate();
  const auth = getAuth();
  const collectionRef = collection(database, 'cardData');
  const [cardName, setCardName] = useState('');
  const [cards, setCards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // Add dataLoaded state

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
        userId: user.uid,
        cardName: cardName,
        fileLink: [
          {
            downloadURL: '',
            fileName: '',
          },
        ],
      })
        .then(() => {
          setIsModalVisible(false);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  const readData = (user) => {
    if (user) {
      const q = query(collectionRef, where('userId', '==', user.uid));

         onSnapshot(
      q,
      (data) => {
        console.log('Data fetched:', data.docs.map((doc) => doc.data()));
        setCards(
          data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setDataLoaded(true);
        },
        (error) => {
          console.error('Error fetching data:', error);
          setDataLoaded(true);
        }
      );
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const openCard = (id) => {
    navigate(`/card/${id}`);
  };

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User UID:', user.uid);
        readData(user);
      } else {
        // Handle the case when the user is not authenticated
        setDataLoaded(true);
      }
    });

    return () => unsubscribe(); // Cleanup the listener

  }, [auth]);

  return (
    <div>
      <div className='icon-logout'>
        <Icon icon='material-symbols:logout' height='60' onClick={handleLogout} />
      </div>
      <div className='title'>
        <h1> CardCache </h1>
      </div>
      <div className='links'>
        <a href='https://www.linkedin.com/in/ryangormican/'>
          <Icon icon='mdi:linkedin' color='#0e76a8' width='60' />
        </a>
        <a href='https://github.com/RyanGormican/CardCache'>
          <Icon icon='mdi:github' color='#e8eaea' width='60' />
        </a>
        <a href='https://ryangormicanportfoliohub.vercel.app/'>
          <Icon icon='teenyicons:computer-outline' color='#199c35' width='60' />
        </a>
      </div>
      <div className='icon-container'>
        <Icon icon='material-symbols:folder' height='60' onClick={showModal} />
      </div>
<div className='grid-parent'>
  {dataLoaded ? (
    cards.map((card) => (
      <div
        className='preview-child'
        key={card.id}
        onClick={() => openCard(card.id)}
      >
        <h4>{card.cardName}</h4>
      </div>
    ))
  ) : (
    <p>Loading...</p>
  )}
</div>
      <Modal
        title='Add a Card'
        open={isModalVisible}
        onOk={cardUpload}
        onCancel={handleCancel}
        centered
      >
        <input
          placeholder='Enter the Card Name...'
          onChange={(event) => setCardName(event.target.value)}
          value={cardName}
        />
      </Modal>
    </div>
  );
}
