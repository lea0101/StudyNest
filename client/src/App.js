import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Login/SignupPage';
import Home from './components/Home/HomePage';
import RoomPage from './components/Room/RoomPage';
import ProtectedRoute from './config/ProtectedRoute';
import ChatPage from "./components/Chat/ChatPage";
import { auth, db } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import WhiteBoard from './components/Whiteboard/WhiteBoard';
import JoinPage from './components/Home/JoinPage';
import Video from './components/Video';

import UserSettings from "./components/Settings/UserSettings";
import NotFoundPage from './Pages/NotFoundPage';
import NotAuthorizedPage from "./Pages/NotAuthorizedPage";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* login and signup */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protect the home and room routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          
          {/* Room-related routes with room authorization */}
          <Route path="/rooms/:roomName" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/whiteboard" element={<ProtectedRoute><WhiteBoard /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/video" element={<ProtectedRoute><Video /></ProtectedRoute>} />
          <Route path="/join/:roomCode" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
          {/* catch-all route for undefined paths */}
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          <Route path="*" element={< NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
