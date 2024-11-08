import React, {createContext, useState, useContext } from 'react';

// create a context
const RoomSettingsContext = createContext();

// custom hook to use RoomSettingsContext
export const useRoomSettings = () => useContext(RoomSettingsContext);

// provider component
export const RoomSettingsProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState('default');
    const [selectedLight, setSelectedLight] = useState('light');

    return (
        <RoomSettingsContext.Provider value={{ selectedColor, setSelectedColor, selectedLight, setSelectedLight }}>
            { children }
        </RoomSettingsContext.Provider>
    );
};
