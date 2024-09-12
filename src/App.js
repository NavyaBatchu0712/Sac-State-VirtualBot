import React, { useState } from 'react';
import './App.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: 'Hi there! Welcome to Sac State!', sender: 'bot' },
    { text: 'How can I assist you today?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      await sendMessageToBackend(inputMessage);
    }
  };

  const sendMessageToBackend = async (message) => {
    setLoading(true);  // Start loading
    try {
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setMessages((messages) => [...messages, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [...messages, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    } finally {
      setLoading(false);  // End loading
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <img src="https://pbs.twimg.com/profile_images/1694778608479522819/X2i2t1LN_400x400.jpg" alt="Sac State Logo" className="logo" />
        <h1>Campus Connect</h1>
      </div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === 'bot' && (
              <img 
                src="https://thumbs.dreamstime.com/b/green-robot-chatbot-template-chat-bot-icon-website-green-robot-chatbot-template-chat-bot-icon-website-vector-316724609.jpg" 
                alt="Bot Icon" 
                className="bot-icon"
              />
            )}
            <p>{message.text}</p>
            {message.sender === 'user' && <span className="user-label">You</span>}
          </div>
        ))}
        {loading && (
          <div className="loading">Bot is typing...</div>
        )}
      </div>
      <div className="input-box">
        <input 
          type="text" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
          placeholder="Type a message" 
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
