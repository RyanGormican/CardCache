import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import UploadModal from './UploadModal';

export default function Card() {
  let params = useParams();
  let navigate = useNavigate();
  const [cards, setCards] = useState([]);

  const storage = getStorage();
  const databaseRef = doc(database, 'cardData', params?.id);

  const onUpload = (fileName) => {
    const fileRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(fileRef, event.target.files[0]);

    // ... rest of your upload logic ...
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

  const openFile = (downloadURL) => {
    window.open(downloadURL, '_blank');
  };

  const goHome = () => {
    navigate('/drive');
  };

  return (
    <div>
      <UploadModal onUpload={onUpload} />
      <div>
        <div className='return' onClick={goHome}>
          <Icon icon="icon-park-outline:return" height="60" />
        </div>
        <div className='icon-container'>
          <div className="upload-btn">
            <Icon icon="mdi:file-document-add-outline" height="60" />
            <input type="file" onChange={getFile} name="myfile" />
          </div>
        </div>
        <div className='folder-title'>
          <h1>{cardName} </h1>
        </div>
        <div className='grid-parent'>
          {cards?.map((card) => {
            return (
              <div className='grid-child' onClick={() => openFile(card.downloadURL)} key={card.fileName}>
                <img className='image-preview' src={card.downloadURL} alt='image' />
                <h5>{card.fileName} </h5>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
