
import './App.css';
import Drive from './components/Drive';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { app, database } from './firebaseConfig';
import Card from './components/Card';
import NestedCard from './components/NestedCard';
function App() {
  return (
    <div>
    <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/drive/" element={<Drive database={database}/>} />
        <Route path="/card/:id" element={<Card database={database}/>} />
        <Route path="/card/:id/nested" element={<NestedCard database={database}/>} />
        <Route path="/card/:id/nested-:nestingLevel" element={<NestedCard database={database}/>} />
    </Routes>
    </div>
  );
}

export default App;
