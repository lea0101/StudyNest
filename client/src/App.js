import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Home from './components/HomePage';
import RoomPage from './components/RoomPage';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from "./components/Chat/ChatPage";
import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import WhiteBoard from './components/WhiteBoard';

import UserSettings from "./components/UserSettings";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/rooms/:roomName" element={<RoomPage />} />
          {/* Protect the home and room routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/rooms/:roomName" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/whiteboard" element={<ProtectedRoute><WhiteBoard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
          //<Route path="/" element={<Home />} />
      //{!user ? <ChatDead/> : <LoginPage />}

export default App;
