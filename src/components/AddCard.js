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

export default function AddCard() {
 const [isModalVisible, setIsModalVisible] = useState(false);
 const showModal = () => {
    setIsModalVisible(true);
  }
   const [cardName, setCardName] = useState('');
   const collectionRef = collection(database, 'cardData');
   const auth = getAuth();
     const handleCancel = () => {
setIsModalVisible(false);
  }
   const cardUpload = async () => {
    const user = auth.currentUser;

    if (collectionRef && user) {
      try {
        await addDoc(collectionRef, {
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
        });

        setIsModalVisible(false);
      } catch (error) {
        alert(error.message);
      }
    }
  };


return(
<div className="prio" onClick={showModal}>
 <Icon icon="material-symbols:folder" height="60" onClick={showModal}/>
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