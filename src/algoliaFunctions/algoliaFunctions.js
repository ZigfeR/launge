import { library } from '../noGit/algo.js';

// Функция для загрузки данных из Algolia
const searchInCollection = async (collection, filters) => {
  try {
    const searchOptions = {
      filters: filters,
    };
    const result = await collection.search('', searchOptions);
    return result.hits;
  } catch (error) {
    console.error('Ошибка при выполнении запроса в Algolia:', error);
    return [];
  }
};

// Функция для загрузки данных из словаря
async function fetchWordsFromAlgolia(setWords) {
  try {
    const result = await library.search('');
    setWords(result.hits);
  } catch (error) {
    console.error('Ошибка при загрузке сообщений из Algolia:', error);
  }
}

// Поиск последней страницы книги
const fetchMaxPage = async (pages) => {
  const maxPageIndexResult = await pages.search('', {
    attributesToRetrieve: ['objectID'],
  });
  const maxPageIndexArrays = maxPageIndexResult.hits.map((item) => item.objectID);
  return maxPageIndexArrays;
};

// Поиск в словаре pageID
const fetchAppPageID = async (library, page) => {
  const searchOptions = {
    filters: `pageID:${page}`,
  };

  return library.search('', searchOptions);
};

// Поиск в страницах objectID
const fetchPagesID = async (pages, page) => {
  const searchOptions = {
    filters: `objectID:${page}`,
  };

  return pages.search('', searchOptions);
};
export { fetchWordsFromAlgolia, searchInCollection, fetchMaxPage, fetchAppPageID, fetchPagesID };
