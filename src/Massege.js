import './App.scss';
import index from './algo';
import React, { useState, useEffect } from 'react';

function Messange(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { hits } = await index.search(''); // Пустой запрос вернет все сообщения
      setMessages(hits);
    };

    fetchMessages();
  }, []); // Пустой массив зависимостей означает, что эффект будет выполняться только после монтирования компонента

  return (
    <div className="chat">
      <div className="chat-title">
        <h1>Norvegian</h1>
        <h2>Page 1</h2>
      </div>
      <div className="messages">
        <div className="messages-content">
          <ul>
            {messages.map((message) => (
              <li key={message.objectID}>{message.text}</li>
              // Отображение других полей сообщения, если необходимо
            ))}
          </ul>
        </div>
      </div>
      <div className="message-box"></div>
    </div>
  );
}

export default Messange;