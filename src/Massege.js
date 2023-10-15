import { useState } from 'react';
import './App.scss';
// import index from './algo';
// import React, { useState, useEffect } from 'react';

function Messange(props) {
  const page = props.arraysPages.pageIndex;
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
                id={
                  highlightedItems.includes(message.objectID)
                    ? 'highlightedTrue'
                    : 'highlightedFalse'
                }
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
