// RoomWrapper.js
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

import { RoomSettingsProvider } from './RoomSettingsContext';

const RoomWrapper = ({ children }) => {
  const { roomName } = useParams();
  const { state } = useLocation();
  const roomCode = state?.roomCode;

  console.log("RoomWrapper roomName: ", roomName);
  console.log("RoomWrapper roomCode: ", roomCode);

  return (
    (<RoomSettingsProvider roomCode={roomCode}>
        {children}
    </RoomSettingsProvider>));
};

export default RoomWrapper;