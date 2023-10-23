// api.js

import { searchInCollection } from '../../algoliaFunctions/algoliaFunctions';

const fetchPagesAsync = async (pages, page) => {
  try {
    const filters = `pageIndex:${page}`;
    const fetchedWords = await searchInCollection(pages, filters);
    return fetchedWords[0];
  } catch (error) {
    console.error('Ошибка при выполнении запроса в Algolia:', error);
  }
};

const fetchDataAsync = async (library, page, offset) => {
  const filters = `pageIndex:${page - offset}`;
  return await searchInCollection(library, filters);
};

export { fetchDataAsync, fetchPagesAsync };
