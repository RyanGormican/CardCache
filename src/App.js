
import './App.css';
import Drive from './components/Drive';
import Auth from './components/Auth';
import { Routes, Route } from ' react-router-dom';
import { app, database } from './firebaseConfig';
import Card from './components/Card';
function App() {
  return (
    <div>
    <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/drive/" element={<Drive database={database}/>} />
        <Route path="/card/:id" element={<Card database={database}/>} />
    </Routes>
    </div>
  );
}

export default App;
