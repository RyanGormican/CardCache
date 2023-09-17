import React, { useState, useEffect } from 'react';
import { Modal, Button, Tag } from 'antd';
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
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Search from './Search';
import { database } from '../firebaseConfig';
import AddCard from './AddCard';
import { readData } from './ReadData';

export default function Drive({database, onThemeToggled}) {
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
  const [view, setView] = useState('grid');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [theme, setTheme] = useState('light'); 
  const user = auth.currentUser;
  const [font, setFont]=useState('Oswald');
  const fonts = ['Oswald', 'Arial', 'Times New Roman', 'Georgia', 'Helvetica'];
  const showSettings = () => {
    setIsSettingsVisible(true);
  };
  const showInfoModal = (card) => {
  setInfoModalVisible(true);
  setFileToView(card);
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
    setInfoModalVisible(false);
  };
  const handleChangeFont = async ( selectedFont) => {
        if (user) {
         const settingsRef = doc(database, 'settings', user.uid);
           await updateDoc(settingsRef, {
           font: selectedFont,
           });
        }
        setFont(selectedFont);
        onThemeToggled();
  };
  const toggleTheme = async()=>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        if (user) {
           const settingsRef = doc(database, 'settings', user.uid);
           await updateDoc(settingsRef, {
           theme: newTheme,
           });
        }
        setTheme(newTheme);
        onThemeToggled();
  };
   const handleColorChange = async (event) => {
   const newColor = event.target.value;
  if (fileToView) {
      try {
        const cardRef = doc(database, 'cardData', fileToView.id);
        await updateDoc(cardRef, {
          color: newColor,
        });
        
        setFileToView((prevFileToView) => ({
          ...prevFileToView,
          color: newColor,
        }));
      } catch (error) {
        console.error('Error updating color:', error);
      }
    }
  };

     const handleColorChangeT = async (event) => {
   const newColor = event.target.value;
  if (fileToView) {
      try {
        const cardRef = doc(database, 'cardData', fileToView.id);
        await updateDoc(cardRef, {
          textColor: newColor,
        });
        
        setFileToView((prevFileToView) => ({
          ...prevFileToView,
          textColor: newColor,
        }));
      } catch (error) {
        console.error('Error updating color:', error);
      }
    }
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
  const checkSettings = async () => {
  if (user){
   const settingsRef = doc(database, 'settings',user.uid);
      const settingsSnapshot = await getDoc(settingsRef);

      if(!settingsSnapshot.exists()){
            await setDoc(settingsRef, {
            userid: user.uid,
            theme: 'light',
            font: 'Oswald',
            });
            setTheme('light');
      }else{
      const settingsData = settingsSnapshot.data();
        setTheme(settingsData.theme);
        setFont(settingsData.font);
      }

      }
  }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
     
        checkSettings();
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
  }, [auth,navigate]);

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
           style={font}
        />
      </div>
      <span className="view-icons">
        <div onClick={() => setView('list')}>
          <Icon icon="material-symbols:list" width="60" />
        </div>
        <div onClick={() => setView('grid')}>
          <Icon icon="mdi:grid" width="60" />
        </div>
      </span>
         <div className={`${theme === 'light' ? 'light-page' : 'dark-page'}`} style={{fontFamily: font}}>
    
</div>
      {view === 'grid' ? (
        <div className="card-parent">
          {dataLoaded ? (
            filteredCards.map((card) => {
              const allTags = [];
              if (card.tags) {
                allTags.push(...card.tags.map((tag) => tag.text));
              }
              card.fileLink?.forEach((file) => {
                if (file.tags && file.tags.length > 0) {
                  allTags.push(...file.tags.map((tag) => tag.text));
                }
              });

              const uniqueTags = Array.from(new Set(allTags));
              return (
                <div className="preview-child" key={card.id}style={{backgroundColor:card.color || 'white', color:card.textColor || 'black'}}>
                  <h4  className="safe" onClick={() => openCard(card.id)}>{card.cardName}</h4>
                  <span  className="safe">
                   <Icon
                icon="material-symbols:palette"
                height='30'
                onClick={() => showInfoModal(card)}
              />
                  <Icon
                    icon="material-symbols:person-add"
                      height='30'
                    onClick={() => handleShareIconClick(card.id)}
                  />
                
              </span>
                  {allTags.length > 0 && (
                    <div  className="safe">
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
              <div className="list-child" key={card.id}style={{backgroundColor:card.color || 'white'}}>
                <h4 onClick={() => openCard(card.id)}>{card.cardName}</h4>
                  <Icon
                icon="material-symbols:palette"
                onClick={() => showInfoModal(card)}
              />
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
        title="Settings"
        open={isSettingsVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
        style={{ fontFamily: font }}
      >

        {theme === 'light'? (
       <Icon icon="ph:moon" height='30' width='30'onClick={toggleTheme}/>) : (

        <Icon icon="ph:sun" height='30' width='30'onClick={toggleTheme}/>
        )}
        <div>
            <select value={font}  onChange={(e) => handleChangeFont(e.target.value)}>
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      <Modal
        title="Share Card"
        open={isSharingModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
        style={{ fontFamily: font }}
      >
        <h3>Shared with:</h3>
        <ul>
          {sharedWithUsers.map((userId) => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
        <div>
          <input type="text" readOnly value={auth.currentUser?.uid} />
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
          placeholder="Enter User ID to Share"
          onChange={(event) => setNewUserId(event.target.value)}
          value={newUserId}
        />
        <button onClick={() => handleAddSharing(currentCardId, newUserId)}>
          Share
        </button>
      </Modal>
       <Modal
		title={`Customize Folder`}
        visible={infoModalVisible}
        centered
		footer={[
			<Button onClick={handleCancel}> Ok </Button>
		]}
        style={{ fontFamily: font }}
      >
        {fileToView && (
      <div>
     Card color:  <input type="color" style={{width:'100%'}} value={fileToView.color || '#ffffff'} onChange={handleColorChange}/>
     Text color:  <input type="color" style={{width:'100%'}} value={fileToView.textColor || 'black'} onChange={handleColorChangeT}/>
      </div>
      )}
      </Modal>
    </div>
  );
}
