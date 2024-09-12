import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: 'Hi there! Welcome to Sac State!', sender: 'bot' },
    { text: 'Please select before I assist you', sender: 'bot' }
  ]);
  const [showStudentOptions, setShowStudentOptions] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [history, setHistory] = useState([]);

  const handleOptionClick = async (option) => {
    setMessages([...messages, { text: option, sender: 'user' }]);

    if (option === 'Student') {
      setHistory([...history, { showStudentOptions, messages }]);
      setShowStudentOptions(true);
    } else {
      setShowStudentOptions(false);
      await sendMessageToBackend(option);
    }
  };

  const handleStudentOptionClick = async (option) => {
    setMessages([...messages, { text: option, sender: 'user' }]);
    setShowStudentOptions(false);
    await sendMessageToBackend(option);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      await sendMessageToBackend(inputMessage);
    }
  };

  const sendMessageToBackend = async (message) => {
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
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setShowStudentOptions(lastState.showStudentOptions);
      setMessages(lastState.messages);
      setHistory([...history]);
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <img
          src="https://pbs.twimg.com/profile_images/1694778608479522819/X2i2t1LN_400x400.jpg"
          alt="Sac State Logo"
          className="logo"
        />
        <h1>Sac State Virtual Assistant</h1>
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
        {!showStudentOptions && (
          <div className="options">
            <button className="option-button" onClick={() => handleOptionClick('Student')}>Student</button>
            <button className="option-button" onClick={() => handleOptionClick('Faculty')}>Faculty</button>
            <button className="option-button" onClick={() => handleOptionClick('Others')}>Others</button>
          </div>
        )}
        {showStudentOptions && (
          <div className="options">
            <button className="option-button" onClick={() => handleStudentOptionClick('New Student')}>New Student</button>
            <button className="option-button" onClick={() => handleStudentOptionClick('Enrolled')}>Enrolled</button>
            <button className="option-button" onClick={() => handleStudentOptionClick('Alumni')}>Alumni</button>
          </div>
        )}
        {history.length > 0 && (
          <div className="back-button-container">
            <button className="back-button" onClick={handleBack}>
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/back.png"
                alt="Back Icon"
                className="back-icon"
              />
            </button>
          </div>
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
