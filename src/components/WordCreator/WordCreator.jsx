import React, { useState, useEffect, useCallback } from 'react';
import { addWordToAlgolia, deleteWordFromAlgolia, editWordInAlgolia } from './WordCreatorAlgolia';
import { fetchWordsFromAlgolia } from '../../algoliaFunctions/algoliaFunctions';

import './App.scss';

function WordCreator(props) {
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState('');
  const [editedWords, setEditedWords] = useState('');
  const [editedWordsID, setEditedWordsID] = useState(null);

  useEffect(() => {
    fetchWordsFromAlgolia(setWords);
  }, []);

  const handleAddWords = useCallback(async () => {
    addWordToAlgolia(newWords, words, setWords, setNewWords, props);
  }, [newWords, words, props]);

  const handleDeleteWords = useCallback(
    async (objectID) => {
      deleteWordFromAlgolia(objectID, words, setWords);
    },
    [words],
  );

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
    <div className="library">
      <div className="library-title">
        <h1>Norvegian</h1>
        <h2>{props.arraysPages.pageName || 'Пусто'}</h2>
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
      <div className="words">
        <div className="words-content">
          <ul>
            {props.words.map((word) => (
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
    </div>
  );
}

export default WordCreator;
