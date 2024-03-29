import './App.css';
import Drive from './components/Drive';
import Auth from './components/Auth';
import { Routes, Route, useLocation } from 'react-router-dom';
import { app, database , auth} from './firebaseConfig';
import Card from './components/Card';
import NestedCard from './components/NestedCard';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
function App() {
  const [theme, setTheme ]= useState('');
  const [toggle, setToggle] = useState(false);
  const [font,setFont]= useState('Oswald');
  const location = useLocation();
  const handleThemeToggled = () => {
     setToggle(!toggle);
  };
  useEffect(() => {
    const checkSettings = async () => {
      if (auth.currentUser) { 
        const settingsRef = doc(database, 'settings', auth.currentUser.uid);
        const settingsSnapshot = await getDoc(settingsRef);
        if (!settingsSnapshot.exists()) {
          await setDoc(settingsRef, {
            userid: auth.currentUser.uid,
            theme: 'light',
            font: 'Oswald',
          });
          setTheme('light');
        } else {
          const settingsData = settingsSnapshot.data();
          console.log(settingsData);
          setTheme(settingsData.theme);
          setFont(settingsData.font);
        }
      }
    };

    checkSettings();
  }, [location, toggle]);
  return (
     <div className={`${theme === 'light' ? 'light-theme' : 'dark-theme'}`} style={{fontFamily: font}}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/drive/" element={<Drive database={database}  onThemeToggled={handleThemeToggled} />} />
        <Route path="/card/:id" element={<Card database={database} />} />
        <Route path="/card/:id/:index" element={<NestedCard database={database} />} />
      </Routes>
    </div>
  );
}

export default App;