import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LoginPage from './components/LoginPage';
import Home from './components/HomePage';
import RoomPage from './components/RoomPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rooms/:roomName" element={<RoomPage />} />
        </Routes>
      </BrowserRouter>
        {/* { <LoginPage />} */}
    </div>
  );
}

export default App;
