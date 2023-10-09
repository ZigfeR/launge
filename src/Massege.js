import { useState } from 'react';
import './App.scss';
// import index from './algo';
// import React, { useState, useEffect } from 'react';

function Messange(props) {
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const { hits } = await index.search(''); // Пустой запрос вернет все сообщения
  //     setMessages(hits);
  //   };

  //   fetchMessages();
  // }, []); // Пустой массив зависимостей означает, что эффект будет выполняться только после монтирования компонента
  const page = props.currentPage;
  const [highlightedItems, setHighlightedItems] = useState([]);

  const toggleHighlight = (messageId) => {
    if (highlightedItems.includes(messageId)) {
      setHighlightedItems(highlightedItems.filter((id) => id !== messageId));
    } else {
      setHighlightedItems([...highlightedItems, messageId]);
    }
  };

  return (
    <div className="chat">
      <div className="chat-title">
        <h1>Day</h1>
        <h2>Page {page}</h2>
      </div>
      <div className="messages">
        <div className="messages-content">
          <ul>
            {props.messages.map((message) => (
              <li
                key={message.objectID}
                id={highlightedItems.includes(message.objectID) ? 'highlighted' : ''}
                onClick={() => toggleHighlight(message.objectID)}>
                {message.text}
              </li>
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
