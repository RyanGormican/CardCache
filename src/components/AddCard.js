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
 const [isModalVisible, setIsModalVisible] = useState(false);
 const showModal = () => {
 console.log("test");
    setIsModalVisible(true);
  }
  const params = useParams();
   const [cardName, setCardName] = useState('');
   const collectionRef = collection(database, 'cardData');

   const auth = getAuth();
     const handleCancel = () => {
setIsModalVisible(false);
  }
  const cardUpload = async () => {
  const user = auth.currentUser;

    try {
    if (cardId && user) {
      const databaseRef = doc(database, 'cardData', cardId);

      await updateDoc(databaseRef, {
        fileLink: [
          ...cards,
          {
            userId: user.uid,
            cardName: cardName,
            sharedWith: [user.uid],
            color: 'white',
            fileLink: [
              {
                downloadURL: '',
                fileName: '',
                fileSize: 0,
                creationTimestamp: 0,
              },
            ],
          },
        ],
      });
    } else if (!cardId && user) {
      await addDoc(collectionRef, {
        userId: user.uid,
        cardName: cardName,
        sharedWith: [user.uid],
        color: 'white',
        fileLink: [
          {
            downloadURL: '',
            fileName: '',
            fileSize: 0,
            creationTimestamp: 0,
          },
        ],
      });

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