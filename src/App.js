import './App.scss';

import React, { useState, useEffect, useCallback } from 'react';
import uuid from 'react-uuid';
import index from './algo';

function App(props) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editedMessage, setEditedMessage] = useState('');
  const [editedMessageID, setEditedMessageID] = useState(null);

  const handleAddMessage = useCallback(async () => {
    const i = props.currentPage;
    const messageObject = {
      objectID: uuid(),
      text: newMessage,
      pageID: props.currentPage,
      pageIndex: [i, i + 2, i + 8, i + 18, i + 99],
      checked: [i, i + 2, i + 8, i + 18, i + 99],
      сreatedOn: new Date().toISOString(),
    };

    try {
      // Отправка сообщения в Algolia
      await index.saveObject(messageObject);

      // Обновление локального состояния после успешной отправки в Algolia
      setMessages([...messages, messageObject]);
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка при добавлении сообщения в Algolia:', error);
    }
  }, [newMessage, messages, props.currentPage]);

  const deleteMessage = async (objectID) => {
    try {
      // Удаление сообщения из Algolia
      await index.deleteObject(objectID);

      // Обновление локального состояния, исключая удаленное сообщение
      setMessages(messages.filter((message) => message.objectID !== objectID));
    } catch (error) {
      console.error('Ошибка при удалении сообщения из Algolia:', error);
    }
  };
  const editMessage = async () => {
    try {
      // Обновление текста сообщения в Algolia
      await index.partialUpdateObject({
        objectID: editedMessageID,
        text: editedMessage,
      });

      // Обновление локального состояния, включая отредактированное сообщение
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.objectID === editedMessageID ? { ...message, text: editedMessage } : message,
        ),
      );

      // Сброс данных для редактирования
      setEditedMessage('');
      setEditedMessageID(null);
    } catch (error) {
      console.error('Ошибка при редактировании сообщения в Algolia:', error);
    }
  };

  useEffect(() => {
    // Функция для загрузки сообщений из Algolia
    const fetchMessagesFromAlgolia = async () => {
      try {
        // Выполняем запрос к Algolia
        const result = await index.search('');

        // Обновляем локальное состояние с данными из Algolia
        setMessages(result.hits);
      } catch (error) {
        console.error('Ошибка при загрузке сообщений из Algolia:', error);
      }
    };

    // Вызываем функцию для загрузки сообщений из Algolia при монтировании компонента
    fetchMessagesFromAlgolia();
  }, []); // Пустой массив зависимостей означает, что эффект будет запущен только при монтировании компонента

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

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
          <h2>Page {props.currentPage}</h2>
          <figure className="avatar avatarEdited">
            <img
              src="https://uploads.commoninja.com/searchengine/wordpress/language-switcher-for-elementor.png"
              alt="img"
            />
          </figure>
          <figure className="avatar avatarSpelling">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ466tCJrc_5MSp_-7oImxSn7zt4PrqLJE5Juy2yPDuO3s5m7ufCSXowrKig6r0zDslx8&usqp=CAU"
              alt="img"
            />
          </figure>
        </div>
        <div className="messages">
          <div className="messages-content">
            <ul>
              {props.messages.map((message) => (
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
