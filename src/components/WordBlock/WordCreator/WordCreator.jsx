import React, { useState, useEffect, useCallback } from 'react';
import { addWordToAlgolia, deleteWordFromAlgolia, editWordInAlgolia } from './WordCreatorAlgolia';

function WordCreator(props) {
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState('');
  const [editedWords, setEditedWords] = useState('');
  const [editedWordsID, setEditedWordsID] = useState(null);

  // Функция для добавления нового слова в Algolia
  const handleAddWords = useCallback(async () => {
    addWordToAlgolia(newWords, words, setWords, setNewWords, props.props);
  }, [newWords, words, props]);

  // Функция для удаления слова из Algolia
  const handleDeleteWords = useCallback(
    async (objectID) => {
      deleteWordFromAlgolia(objectID, words, setWords);
    },
    [words],
  );

  // Функция для редактирования слова в Algolia
  const handleEditWords = useCallback(async () => {
    editWordInAlgolia(
      editedWordsID,
      editedWords,
      words,
      setWords,
      setEditedWords,
      setEditedWordsID,
    );
  }, [editedWords, editedWordsID, words]);

  const handleInputChange = (event) => {
    setNewWords(event.target.value);
  };

  //Отправка сообщений по нажатию Enter
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleAddWords();
      }
    },
    [handleAddWords],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <>
      <div className="words">
        <div className="words-content">
          <ul>
            {props.props.words.map((word) => (
              <li key={word.objectID}>
                <div>
                  {word.text}
                  <div>
                    <button
                      className="edit fas fa-pencil-alt"
                      onClick={() => {
                        setEditedWords(word.text);
                        setEditedWordsID(word.objectID);
                      }}></button>
                    <button
                      type="submit"
                      className="word-submit delete fas fa-trash-alt"
                      onClick={() => handleDeleteWords(word.objectID)}></button>
                  </div>
                </div>
                {editedWordsID === word.objectID && (
                  <div className="words-editedWordsID">
                    <input
                      type="text"
                      value={editedWords}
                      className="words-edited"
                      onChange={(e) => setEditedWords(e.target.value)}
                    />
                    <button onClick={handleEditWords} className="words-save">
                      Save
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="words-box">
        <input
          type="text"
          className="words-input"
          placeholder="Enter a word..."
          value={newWords}
          onChange={handleInputChange}></input>
        <button type="submit" className="words-submit" onClick={handleAddWords}>
          Send
        </button>
      </div>
    </>
  );
}

export default WordCreator;
