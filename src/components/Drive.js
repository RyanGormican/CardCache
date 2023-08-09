import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import UploadModal from './UploadModal';

export default function Drive() {
  let navigate = useNavigate();
  const collectionRef = collection(database, 'cardData');
  const [cards, setCards] = useState([]);

  const onUpload = (cardName) => {
    addDoc(collectionRef, {
      cardName: cardName,
      fileLink: [{
        downloadURL: '',
        fileName: '',
      }],
    })
    .catch(err => {
      alert(err.message);
    });
  };

  useEffect(() => {
    onSnapshot(collectionRef, (data) => {
      setCards(data.docs.map((doc) => { 
        return {...doc.data(), id: doc.id};
      }));
    });
  }, []);

  const openCard = (id) => {
    navigate(`/card/${id}`);
  };

  return (
    <div>
      <UploadModal onUpload={onUpload} />
      <div>
        <div className='icon-container'>
          <div className="upload-btn">
            <Icon icon="mdi:file-document-add-outline" height="60" />
            <input type="file" name="myfile" />
          </div>
          <Icon icon="material-symbols:folder" height="60" onClick={showModal} />
        </div>
        <div className='grid-parent'>
          {cards.map((card) => (
            <div className='preview-child' onClick={() => openCard(card.id)} key={card.id}>
              <h4>{card.cardName}</h4>
            </div>
          ))}
        </div>
        <Modal 
          title="Card Upload" 
          open={isModalVisible} 
          onOk={cardUpload} 
          onCancel={handleCancel} 
          centered
        >
          <input placeholder="Enter the Card Name..." 
            onChange={(event) => setCardName(event.target.value)}
            value={cardName}
          />
        </Modal>
      </div>
    </div>
  );
}
