import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LoginPage from './components/Login';
import Home from './components/Home';
import ChatPage from "./components/ChatPage";
import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element=
      {user ? <ChatPage/> : <LoginPage />}
 />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
          //<Route path="/" element={<Home />} />
      //{!user ? <ChatDead/> : <LoginPage />}

export default App;
