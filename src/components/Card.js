import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import UploadModal from './UploadModal';

export default function Card() {
  let params = useParams();
  let navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');

  const storage = getStorage();
  const databaseRef = doc(database, 'cardData', params?.id);

  const onUpload = async (fileName, event) => {
    const fileRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(fileRef, event.target.files[0]);

    try {
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updatedCards = [
        ...cards,
        {
          downloadURL: downloadURL,
          fileName: fileName,
        },
      ];

      await updateDoc(databaseRef, { fileLink: updatedCards });
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  const getFile = (event) => {
    const fileName = event.target.files[0].name;
    onUpload(fileName, event);
  };

  const openFile = (downloadURL) => {
    window.open(downloadURL, '_blank');
  };

  const goHome = () => {
    navigate('/drive');
  };

  useEffect(() => {
    onSnapshot(databaseRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setCards(data.fileLink);
        setCardName(data.cardName);
      }
    });
  }, []);

  return (
    <div>
      <UploadModal onUpload={onUpload} />
      <div>
        <div className='return' onClick={goHome}>
          <Icon icon="icon-park-outline:return" height="60" />
        </div>
        <div className='icon-container'>
          <div className='upload-btn'>
            <Icon icon="mdi:file-document-add-outline" height="60" />
            <input type="file" onChange={getFile} name="myfile" />
          </div>
        </div>
        <div className='folder-title'>
          <h1>{cardName} </h1>
        </div>
        <div className='grid-parent'>
          {cards?.map((card, index) => (
            <div className='grid-child' onClick={() => openFile(card.downloadURL)} key={index}>
              <img className='image-preview' src={card.downloadURL} alt='image' />
              <h5>{card.fileName} </h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
