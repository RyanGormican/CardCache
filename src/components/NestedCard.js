import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { Icon } from '@iconify/react';
import {
 doc,
  getDoc,
} from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import Player from './Player';
import { database, storage } from '../firebaseConfig';

export default function NestedCardSpace() {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const databaseRef = doc(database, 'cardData', id);
  const [mainCard, setMainCard] = useState(null);
  const [nestedCard, setNestedCard] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDoc(databaseRef);
      const data = snapshot.data();
      if (data) {
        setMainCard(data);
        if (data.fileLink && data.fileLink.length > 0) {
          setNestedCard(data.fileLink[index]);
        }
      }
    };

    fetchData();
  }, [databaseRef, index]);

  const showInfoModal = () => {
    setInfoModalVisible(true);
  };

  const hideInfoModal = () => {
    setInfoModalVisible(false);
  };

  return (
    <div>
     
    
    </div>
  );
}
