import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';

export default function Drive() {
  const navigate = useNavigate();
  const auth = getAuth();
  const userUID = auth.currentUser.uid;

  const collectionRef = collection(database, 'users', userUID, 'cards'); // Use user-specific subcollection
  const [cardName, setCardName] = useState('');
  const [cards, setCards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const cardUpload = () => {
    addDoc(collectionRef, {
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
  };

  const readData = () => {
    onSnapshot(collectionRef, (data) => {
      setCards(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })));
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const openCard = (id) => {
    navigate(`/card/${id}`);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <div>
      <div className='icon-logout'>
        <Icon icon="material-symbols:logout" height="60" onClick={handleLogout} />
      </div>
      <div className='title'>
        <h1>CardCache</h1>
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
        {cards.map((card) => (
          <div
            key={card.id}
            className='preview-child'
            onClick={() => openCard(card.id)}
          >
            <h4>{card.cardName}</h4>
          </div>
        ))}
      </div>

      <Modal
        title="Add a Card"
        visible={isModalVisible}
        onOk={cardUpload}
        onCancel={handleCancel}
        centered
      >
        <input
          placeholder="Enter the Card Name..."
          onChange={(event) => setCardName(event.target.value)}
          value={cardName}
        />
      </Modal>
    </div>
  );
}
