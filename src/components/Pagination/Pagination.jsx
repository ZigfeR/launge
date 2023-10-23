import React, { useState, useEffect, useCallback } from 'react';
import { pages, library } from '../../noGit/algo.js';
import uuid from 'react-uuid';
import { fetchDataAsync } from './PaginationAlgolia.js';
import {
  fetchAppPageID,
  fetchMaxPage,
  fetchPagesID,
  searchInCollection,
} from '../../algoliaFunctions/algoliaFunctions.js';

import PaginationButtons from './PaginationButtons/PaginationButtons.jsx';

// Компонент для логики пагинации
function Pagination({ onPropsCurrentPage, onPropsWords }) {
  const [words, setWords] = useState([]);
  const [arraysPag, setArraysPag] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(100);
  const [addPages, setAddPages] = useState([]);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const generatedObjectID = uuid();

  let activePageID;

  // Извлечение активного ID
  const fetchPagesAsync = async (page) => {
    try {
      const filters = `pageIndex:${page}`;
      const fetchedWords = await searchInCollection(pages, filters);
      activePageID = fetchedWords[0];
    } catch (error) {
      console.error('Ошибка при выполнении запроса в Algolia:', error);
    }
  };

  useEffect(() => {
    console.log('Компонент монтируется');

    // Извлечение активного ID
    const fetchAllData = async () => {
      try {
        console.log('Запрашиваем данные...');

        await fetchPagesAsync(currentPage);

        if (activePageID && activePageID.objectID) {
          const [app, pagesHits, one, two, tree, four, five] = await Promise.all([
            fetchAppPageID(library, activePageID.objectID),
            fetchPagesID(pages, activePageID.objectID),
            fetchDataAsync(library, currentPage, 0),
            fetchDataAsync(library, currentPage, 2),
            fetchDataAsync(library, currentPage, 6),
            fetchDataAsync(library, currentPage, 10),
            fetchDataAsync(library, currentPage, 81),
          ]);
          const updatedWords = {
            app: app.hits,
            pages: pagesHits.hits[0],
            one,
            two,
            tree,
            four,
            five,
          };
          setWords(updatedWords);
          onPropsWords(updatedWords);

          console.log('Данные успешно загружены');
          setDataLoaded(true);
        } else {
          console.log(
            'activePageID или activePageID.objectID не определены. Невозможно выполнить запросы данных.',
          );
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных: useEffect', error);
      }
    };

    // Создание первой страницы если чистая книга
    const checkAndAddPage = async () => {
      await fetchAllData();

      const maxPageIndexArrays = await fetchMaxPage(pages);
      setArraysPag(maxPageIndexArrays);

      try {
        if (!isRequestSent && maxPageIndexArrays.length === 0) {
          const defaultPageObject = {
            objectID: generatedObjectID,
            pageName: `Leasson 1`,
            pageIndex: 1,
            pageList: [1, 3, 9, 19, 100],
          };

          await pages.saveObject(defaultPageObject);
          console.log(`Новая страница создана Leasson 1 с objectID ${generatedObjectID}.`);
          setAddPages([defaultPageObject]);

          // Устанавливаем флаг, чтобы предотвратить повторный запрос
          setIsRequestSent(true);
        } else {
          console.log(`Страницы существуют в массиве pageIndex или запрос уже отправлен.`);
        }
      } catch (error) {
        console.error('Ошибка при добавлении страницы в Algolia:', error);
      }
    };
    checkAndAddPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Создание новой страницы с objectID
  const handleAddPages = useCallback(
    async (pageNumber) => {
      const i = pageNumber;
      const pageObject = {
        objectID: generatedObjectID,
        pageName: `Leasson ${pageNumber}`,
        pageIndex: i,
        pageList: [i, i + 2, i + 8, i + 18, i + 99],
      };

      setMaxPage(i + 99);

      try {
        if (activePageID && activePageID.pageIndex !== undefined) {
          // Проверка существующей записи по objectID
          if (arraysPag.includes(activePageID.objectID)) {
            console.log(`Страница с objectID ${activePageID.objectID} уже существует.`);
          } else {
            await pages.saveObject(pageObject);
            console.log(`Новая страница создана с objectID ${generatedObjectID}.`);
            setAddPages([...addPages, pageObject]);
          }
        } else {
          await pages.saveObject(pageObject);
          console.log(`Новая страница создана с objectID ${generatedObjectID}.`);
          setAddPages([...addPages, pageObject]);
        }
      } catch (error) {
        console.error('Ошибка при добавлении страницы в Algolia:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addPages, arraysPag, generatedObjectID],
  );

  const handlePaginationClick = async (pageNumber) => {
    const updatedWords = {
      ...words,
      pages: [],
    };
    setWords(updatedWords);
    onPropsWords(updatedWords);

    await fetchPagesAsync(pageNumber);
    setCurrentPage(pageNumber);
    onPropsCurrentPage(pageNumber);
    await handleAddPages(pageNumber);
  };
  // console.log('CURVA');

  return (
    <>
      {dataLoaded && (
        <div className="container">
          <PaginationButtons
            currentPage={currentPage}
            maxPage={maxPage}
            onPageChange={handlePaginationClick}
          />
        </div>
      )}
    </>
  );
}

export default Pagination;
