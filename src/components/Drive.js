import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, Tag } from 'antd';
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
import AddCard from './AddCard';
  import { readData } from './ReadData';
export default function Drive() {
  const navigate = useNavigate();
  const [filteredCards, setFilteredCards] = useState([]);
  const auth = getAuth();
  const collectionRef = collection(database, 'cardData');
  const [cards, setCards] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isSharingModalVisible, setIsSharingModalVisible] = useState(false);
  const [currentCardId, setCurrentCardId] = useState('');
  const [sharedWithUsers, setSharedWithUsers] = useState([]);
  const [newUserId, setNewUserId] = useState('');
  const [view,setView] = useState('grid');
  const showSettings = () => {
    setIsSettingsVisible(true);
  };

 

  const handleFilterChange = (filteredCards) => {
    setFilteredCards(filteredCards);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleCancel = () => {
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

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User UID:', user.uid);
        readData(
          user,
          (fetchedCards) => {
            setCards(fetchedCards);
            setDataLoaded(true);
          },
          (error) => {
            setDataLoaded(true);
          }
        );
      } else {
        navigate('/');
        setDataLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
        <Icon icon="mdi:gear" width="60" onClick={showSettings} />
        <AddCard cards={cards} />
      </div>
      <div className="search-title2">
      <Search
        cards={cards}
        filtering={filteredCards}
        onFilterChange={handleFilterChange}
        type="drive"
      />
      </div>
       <span className="view-icons">
         <div  onClick={() => setView('list')}>
      <Icon icon="material-symbols:list" width="60"   />
      </div>
       <div  onClick={() => setView('grid')}>
      <Icon icon="mdi:grid" width="60" />
      </div>
      </span>
      {view === 'grid'? (
       <div className="card-parent">
    {dataLoaded ? (
      filteredCards.map((card) => {
  
         const allTags = [];
        if (card.tags) {
          allTags.push(...card.tags.map(tag => tag.text));
        }
        card.fileLink?.forEach((file) => {
          if (file.tags && file.tags.length > 0) {
            allTags.push(...file.tags.map(tag => tag.text));
          }
        });

        const uniqueTags = Array.from(new Set(allTags));
        return (
          <div className="preview-child" key={card.id}>
            <h4 onClick={() => openCard(card.id)}>{card.cardName}</h4>
            <Icon
              icon="material-symbols:person-add"
              onClick={() => handleShareIconClick(card.id)}
            />
            {allTags.length > 0 && (
              <div>
                {uniqueTags.map((tag, index) => (
                  <Tag key={index} className="tag">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        );
      })
    ) : (
      <p>Loading...</p>
    )}
  </div>
    ) : ( 
    <div className="list-parent">
  {dataLoaded ? (
          filteredCards.map((card) => (
            <div className="list-child" key={card.id}>
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
    )}

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
    </div>
  );
}
