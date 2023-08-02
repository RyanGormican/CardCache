
import './App.css';
import Drive from './components/Drive';
import { Routes, Route } from ' react-router-dom'
function App() {
  return (
    <div>
    <Routes>
        <Route path="/drive/:id" element={<Drive />} />
    </Routes>
    </div>
  );
}

export default App;
