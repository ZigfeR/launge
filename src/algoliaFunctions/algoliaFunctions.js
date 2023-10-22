// Выносим функции, связанные с Algolia, в отдельный модуль
import { library } from '../noGit/algo.js'; // Предполагаем, что у вас есть модуль с функциями для работы с Algolia

// Функция для загрузки данных из Algolia
async function fetchWordsFromAlgolia(setWords) {
  try {
    const result = await library.search('');
    setWords(result.hits);
  } catch (error) {
    console.error('Ошибка при загрузке сообщений из Algolia:', error);
  }
}

export { fetchWordsFromAlgolia };
