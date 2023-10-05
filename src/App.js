import './App.scss';

import React, { useState, useEffect, useCallback } from 'react';
import uuid from 'react-uuid';
import index from './algo';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editedMessage, setEditedMessage] = useState('');
  const [editedMessageID, setEditedMessageID] = useState(null);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { hits } = await index.search(''); // Пустой запрос вернет все сообщения
      setMessages(hits);
    };

    fetchMessages();
  }, []); // Пустой массив зависимостей означает, что эффект будет выполняться только после монтирования компонента

  const deleteMessage = async (objectID) => {
    try {
      await index.deleteObject(objectID);
      // Успешное удаление, обновите состояние, чтобы отобразить обновленные данные без удаленного сообщения
      setMessages(messages.filter((message) => message.objectID !== objectID));
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error);
      // Обработка ошибки удаления
    }
  };
  const editMessage = async () => {
    try {
      await index.partialUpdateObject({ objectID: editedMessageID, text: editedMessage });
      // Успешное редактирование, обновите только отредактированное сообщение в состоянии
      setMessages(
        messages.map((message) =>
          message.objectID === editedMessageID ? { ...message, message: editedMessage } : message,
        ),
      );
      const updatedMessages = messages.map((message) => {
        if (message.objectID === editedMessageID) {
          // Если это редактируемое сообщение, обновите только поле text
          return { ...message, text: editedMessage };
        }
        return message; // Оставьте другие сообщения без изменений
      });
      setMessages(updatedMessages);
      setEditedMessage('');
      setEditedMessageID(null);
    } catch (error) {
      console.error('Ошибка при редактировании сообщения:', error);
      // Обработка ошибки редактирования
    }
  };
  const handleAddMessage = useCallback(() => {
    const messageObject = {
      objectID: uuid(),
      text: newMessage,
      pageID: '1',
      pageIndex: '1',
      checked: true,
      сreatedOn: new Date().toISOString(),
    };

    // Отправка сообщения в Algolia
    index
      .saveObject(messageObject)
      .then(({ objectID }) => {
        console.log('Сообщение успешно добавлено с objectID:', objectID);
        // Обновление локального состояния после успешной отправки в Algolia
        setMessages([...messages, messageObject]);
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Ошибка при добавлении сообщения в Algolia:', error);
      });

    // Очистка поля ввода
    setNewMessage('');
  }, [newMessage, messages]);
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Если нажата клавиша "Enter", добавить сообщение
        handleAddMessage();
      }
    };

    // Добавляем обработчик события клавиатуры при монтировании компонента
    window.addEventListener('keydown', handleKeyPress);

    // Удаляем обработчик события клавиатуры при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleAddMessage]);

  return (
    <div className="App">
      <div className="chat">
        <div className="chat-title">
          <h1>Norvegian</h1>
          <h2>Page 1</h2>
          <figure className="avatar">
            <img
              src="https://uploads.commoninja.com/searchengine/wordpress/language-switcher-for-elementor.png"
              alt="img"
            />
          </figure>
        </div>
        <div className="messages">
          <div className="messages-content">
            <ul>
              {messages.map((message) => (
                <li key={message.objectID}>
                  <div>
                    {message.text}
                    <div>
                      <button
                        className="edit fas fa-pencil-alt"
                        onClick={() => {
                          setEditedMessage(message.text);
                          setEditedMessageID(message.objectID);
                        }}></button>
                      <button
                        type="submit"
                        className="message-submit delete fas fa-trash-alt"
                        onClick={() => deleteMessage(message.objectID)}></button>
                    </div>
                  </div>
                  {editedMessageID === message.objectID && (
                    <div className="message-editedMessageID">
                      <input
                        type="text"
                        value={editedMessage}
                        className="message-edited"
                        onChange={(e) => setEditedMessage(e.target.value)}
                      />
                      <button onClick={editMessage} className="message-save">
                        Save
                      </button>
                    </div>
                  )}
                </li>
                // Отображение других полей сообщения, если необходимо
              ))}
            </ul>
          </div>
        </div>
        <div className="message-box">
          <input
            type="text"
            className="message-input"
            placeholder="Enter a word..."
            value={newMessage}
            onChange={handleInputChange}></input>
          <button type="submit" className="message-submit" onClick={handleAddMessage}>
            Send
          </button>
        </div>
      </div>
      {/* <div className="bg"></div> */}
    </div>
  );
}

export default App;
