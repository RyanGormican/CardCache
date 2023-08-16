import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import { Icon } from '@iconify/react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useParams, useNavigate} from 'react-router-dom';
export default function AddCard({cardId, cards }) {
 const [isModalVisible, setIsModalVisible] = useState(true);
 const showModal = () => {
 console.log("test");
    setIsModalVisible(true);
  }
  const params = useParams();
   const [cardName, setCardName] = useState('');
   const collectionRef = collection(database, 'cardData');
const databaseRef = doc(database, 'cardData', params?.id);

   const auth = getAuth();
     const handleCancel = () => {
setIsModalVisible(false);
  }
const cardUpload = async () => {
  const user = auth.currentUser;

  try {
    if (user) {
      const newCard = {
        userId: user.uid,
        cardName: cardName,
        sharedWith: [user.uid],
        fileLink: [
          {
            downloadURL: '',
            fileName: '',
            fileSize: 0,
            creationTimestamp: 0,
          },
        ],
      };

      if (cardId) {
        // Update an existing card's fileLink array
        const updatedCards = cards.map((card) =>
          cards.id === cardId
            ? { ...cards, fileLink: [...card.fileLink, newCard.fileLink[0]] }
            : cards
        );

        await updateDoc(databaseRef, { fileLink: updatedCards });
      } else {
        // Add a new card to the collection
        await addDoc(collectionRef, {
          ...newCard,
        });
      }

      setIsModalVisible(false);
    }
  } catch (error) {
    alert(error.message);
  }
};





return(
<div className="prio">
   <div  onClick={showModal}  style={{ cursor: 'pointer' }}>
         <Icon icon="material-symbols:folder" height="60"/>
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
)


}