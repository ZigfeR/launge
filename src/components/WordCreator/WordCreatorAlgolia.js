// Выносим функции, связанные с Algolia, в отдельный модуль
import uuid from 'react-uuid';
import { library } from '../../noGit/algo.js'; // Предполагаем, что у вас есть модуль с функциями для работы с Algolia

// Функция для добавления нового слова в Algolia
async function addWordToAlgolia(newWords, words, setWords, setNewWords, props) {
  const i = props.arraysPages.pageIndex;
  const wordsObject = {
    objectID: uuid(),
    text: newWords,
    pageID: props.arraysPages.objectID,
    pageIndex: [i, i + 2, i + 8, i + 18, i + 99],
    checked: [i, i + 2, i + 8, i + 18, i + 99].map((num) => {
      return {
        page: num,
        isChecked: false,
      };
    }),
    сreatedOn: new Date().toISOString(),
  };

  try {
    // Отправка сообщения в Algolia
    await library.saveObject(wordsObject);

    // Обновление локального состояния после успешной отправки в Algolia
    setWords([...words, wordsObject]);
    setNewWords('');
  } catch (error) {
    console.error('Ошибка при добавлении сообщения в Algolia:', error);
  }
}

// Функция для удаления слова из Algolia
async function deleteWordFromAlgolia(objectID, words, setWords) {
  try {
    // Удаление сообщения из Algolia
    await library.deleteObject(objectID);

    // Обновление локального состояния, исключая удаленное сообщение
    setWords(words.filter((word) => word.objectID !== objectID));
  } catch (error) {
    console.error('Ошибка при удалении сообщения из Algolia:', error);
  }
}

// Функция для редактирования слова в Algolia
async function editWordInAlgolia(
  editedWordsID,
  editedWords,
  words,
  setWords,
  setEditedWords,
  setEditedWordsID,
) {
  try {
    // Обновление текста сообщения в Algolia
    await library.partialUpdateObject({
      objectID: editedWordsID,
      text: editedWords,
    });

    // Обновление локального состояния, включая отредактированное сообщение
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.objectID === editedWordsID ? { ...word, text: editedWords } : word,
      ),
    );

    // Сброс данных для редактирования
    setEditedWords('');
    setEditedWordsID(null);
  } catch (error) {
    console.error('Ошибка при редактировании сообщения в Algolia:', error);
  }
}

export { addWordToAlgolia, deleteWordFromAlgolia, editWordInAlgolia };
