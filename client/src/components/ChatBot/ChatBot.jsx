/* eslint-disable no-unused-vars */
import { SendOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import Message from './Message';
import { Images } from '../../constants';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {PropTypes} from 'prop-types';

import './ChatBot.scss'; // Import CSS file for styling

function ChatBot({ onChatClose }) {
  const [inputValue, setInputValue] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [sessionId, setsessionId] = useState(`${Date.now()}`);
  const [messages, setMessages] = useState([]);

  // const CHATBOT_API_KEY = import.meta.env.CHATBOT_API_KEY;
  const CHATBOT_API_KEY = "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";

  useEffect(() => {
    const loadMessages = async () => {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/eventify_server/chatBot/`, {
        params: {
          sessionId
        }
      });
      setMessages(response.data);
    };
    loadMessages();
  }, [sessionId]);

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (inputValue.trim() !== '') {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/eventify_server/chatBot/`, {
            sessionId ,
            sender: "user",
            inputValue ,
        });
        console.log(response.body);
        setMessages([...messages, { content: inputValue, sender: 'user', timestamp: new Date().toISOString() }]);
        setInputValue('');
        // await processMessageToChatbot(messages);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
  };

  const processMessageToChatbot = async (chatMessages) => {
    // apiMessage format : {'role': 'user' or 'assistant', 'content': "The Message Content Here"}
    // roles : 1. 'user' -> Message from the user  2. 'assistant': Message from the bot  3. 'system' ->  One initial message to set the tone of the bot
    
    let apiMessages = chatMessages.map((messageObject) => {
      return { role: messageObject.sender, content: messageObject.content }
    });

    const systemMessage = {
      role: 'system',
      content: 'Speak like a Marriage Hall Booking Agent and be clear about every single thing related to Marriage and Wedding.'
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + CHATBOT_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=> {
      return data.json();
    }).then((data)=> {
      console.log(data.choices[0].message.content);
      setMessages(...chatMessages, {content: data.choices[0].message.content, sender: "assistant"});
    });
  }

  const handleChatClose = () => {
    onChatClose();
  };

  return (
    <div className="chatbot__container">
      <div className="chatbot__header">
        <div className="logo-container">
          <img src={Images.logo} alt="Logo" className="logo" />
          <span className="brand-name"><strong>EventifyConnect</strong> is here to assist you</span>
          <div className="close-icon" onClick={handleChatClose}>❌</div>
        </div>
      </div>
      <div className="message-box">
        <Message text={"Hi, it's great to see you! 👋"} />
        {messages.map((message, index) => (
          <Message key={index} text={message.content} user={message.sender} />
        ))}
      </div>
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <Input className="input-field" placeholder="Ask me anything ..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} suffix={<SendOutlined className="send-icon" type="submit" />} />
        </form>
      </div>
    </div>
  );
}

ChatBot.propTypes = {
  onChatClose: PropTypes.func.isRequired,
};

export default ChatBot;
