import React, { useState, useEffect } from 'react';

// import { useAuth0 } from '@auth0/auth0-react';

import { socket } from './Socket';

import './Chat.css';

const Chat = () => {
    // const { user } = useAuth0();
    const [user, setUser] = useState({ nickname: `Test User ${Math.floor(Math.random() * 1000)}` });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // const socket = null;
    
    useEffect(() => {
        if (socket) {
            socket.on('chat message', (msg) => {
                setMessages((messages) => [...messages, msg]);
            });
        }
    }, [socket]);
    
    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('chat message', { user: user.nickname, message });
        console.log(`Message sent from ${user.nickname}:`, message);
        setMessage('');
    };
    
    return (
        <div className='chat'>
        <div className='chat__messages'>
            {messages.map((msg, index) => (
            <div key={index} className='chat__message'>
                <span className='chat__user'>{msg.user}</span>
                <span className='chat__message'>{msg.message}</span>
            </div>
            ))}
        </div>
        <form className='chat__form' onSubmit={sendMessage}>
            <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            />
            <button type='submit'>Send</button>
        </form>
        </div>
    );
};

export default Chat;