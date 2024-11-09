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
import FileCollab from "./components/FileFeature/FileCollab";
import WhiteBoard from './components/Whiteboard/WhiteBoard';
import JoinPage from './components/Home/JoinPage';
import Video from './components/Video/Video';
import BrainBreakPage from './components/BrainBreak/BrainBreakPage';
import Hangman from './components/BrainBreak/Hangman';

import UserSettings from "./components/Settings/UserSettings";
import NotFoundPage from './Pages/NotFoundPage';
import NotAuthorizedPage from "./Pages/NotAuthorizedPage";

import { TimerProvider } from './components/Timer/TimerContext';
import { RoomSettingsProvider } from './components/Room/RoomSettingsContext';
import RoomWrapper from './components/Room/RoomWrapper';
import Meditation from './components/BrainBreak/Meditation';

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
          <Route path="/rooms/:roomName" element={<ProtectedRoute><RoomWrapper><RoomPage /></RoomWrapper></ProtectedRoute>} />
          <Route path="/rooms/:roomName/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/whiteboard" element={<ProtectedRoute><WhiteBoard /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/filecollab" element={<ProtectedRoute><FileCollab /></ProtectedRoute>} />
          <Route path="/rooms/:roomName/video" element={<ProtectedRoute><Video /></ProtectedRoute>} />
          <Route path="/join/:roomCode" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />

          {/* <Route path="/rooms/:roomName/brainbreak" element={<ProtectedRoute><RoomWrapper><BrainBreakPage /></RoomWrapper></ProtectedRoute>} />
          <Route path="/rooms/:roomName/brainbreak/hangman" element={<ProtectedRoute><RoomWrapper><Hangman /></RoomWrapper></ProtectedRoute>} /> */}
          <Route
            path="/rooms/:roomName/*"
            element={
              <ProtectedRoute>
                <RoomWrapper>
                  <Routes>
                    <Route path="brainbreak" element={<BrainBreakPage />} />
                    <Route path="brainbreak/hangman" element={<Hangman />} />
                    <Route path="brainbreak/meditation" element={< Meditation/>} />
                  </Routes>
                </RoomWrapper>
              </ProtectedRoute>
            }
          />


          {/* catch-all route for undefined paths */}
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          <Route path="*" element={< NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
