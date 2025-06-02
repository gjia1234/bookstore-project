import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Customer  from './components/Customer';
import Seller from './components/Seller';
import { Toolbar } from '@mui/material';

const App = () => {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Toolbar />
        <Routes>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/customer" element={<Customer />} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;
