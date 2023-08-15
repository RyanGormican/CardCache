import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Search from './Search';
import { database } from '../firebaseConfig';

export default function Drive() {
  const navigate = useNavigate();
  const [filteredCards, setFilteredCards] = useState([]);
  const auth = getAuth();
  const collectionRef = collection(database, 'cardData');
  const [cardName, setCardName] = useState('');
  const [cards, setCards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isSharingModalVisible, setIsSharingModalVisible] = useState(false);
  const [currentCardId, setCurrentCardId] = useState('');
  const [sharedWithUsers, setSharedWithUsers] = useState([]);
  const [newUserId, setNewUserId] = useState('');

  const showSettings = () => {
    setIsSettingsVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleFilterChange = (filteredCards) => {
    setFilteredCards(filteredCards);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsSettingsVisible(false);
    setIsSharingModalVisible(false);
  };

  const handleShareIconClick = (cardId) => {
    setCurrentCardId(cardId);
    setIsSharingModalVisible(true);

    // Fetch sharedWith users for the selected card
    const card = cards.find((card) => card.id === cardId);
    setSharedWithUsers(card.sharedWith || []);
  };

  const handleAddSharing = async (cardId, userId) => {
    if (!userId) {
      return;
    }
    const cardRef = doc(database, 'cardData', cardId);

    // Add the new user ID to the sharedWith array
    await updateDoc(cardRef, {
      sharedWith: [...sharedWithUsers, userId],
    });

    // Update the sharedWithUsers state
    setSharedWithUsers([...sharedWithUsers, userId]);
  };

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

  const openCard = (id) => {
    navigate(`/card/${id}`);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User UID:', user.uid);
        readData(user);
      } else {
        navigate('/');
        // Handle the case when the user is not authenticated
        setDataLoaded(true);
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [auth]);

  const readData = (user) => {
    if (user) {
      const q = query(
        collectionRef,
        where('sharedWith', 'array-contains', user.uid)
      );

      onSnapshot(
        q,
        (data) => {
          console.log('Data fetched:', data.docs.map((doc) => doc.data()));
          const fetchedCards = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCards(fetchedCards);
          setDataLoaded(true);
          console.log(fetchedCards); // Log the fetchedCards array here
        },
        (error) => {
          console.error('Error fetching data:', error);
          setDataLoaded(true);
        }
      );
    }
  };

  return (
    <div>
      <div className="icon-logout" onClick={handleLogout}>
        <Icon icon="material-symbols:logout" height="60" />
      </div>
      <div className="title">
        <h1> CardCache </h1>
      </div>
      <div className="links">
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
      <div onClick={showModal} className="prio">
         <Icon icon="material-symbols:folder" height="60" onClick={showModal} />
          </div>
      <div className="search-title2">
      <Search
        cards={cards}
        filtering={filteredCards}
        onFilterChange={handleFilterChange}
        type="drive"
      />
      </div>
      <div className="card-parent">
        {dataLoaded ? (
          filteredCards.map((card) => (
            <div className="preview-child" key={card.id}>
              <h4 onClick={() => openCard(card.id)}>{card.cardName}</h4>
              <Icon
                icon="material-symbols:person-add"
                onClick={() => handleShareIconClick(card.id)}
              />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
     <Modal
        title='Settings'
        open={isSettingsVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
      >
        {/* Add settings content here */}
      </Modal>

      <Modal
        title='Share Card'
        open={isSharingModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
      >
        <h3>Shared with:</h3>
        <ul>
          {sharedWithUsers.map((userId) => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
         <div>
    <input
      type='text'
      readOnly
      value={auth.currentUser?.uid}
    />
    <button
      onClick={() => {
        const input = document.querySelector('input');
        if (input) {
          input.select();
          document.execCommand('copy');
        }
      }}
    >
      Copy
    </button>
  </div>
        <input
          placeholder='Enter User ID to Share'
          onChange={(event) => setNewUserId(event.target.value)}
          value={newUserId}
        />
        <button onClick={() => handleAddSharing(currentCardId, newUserId)}>
          Share
        </button>
      </Modal>
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
