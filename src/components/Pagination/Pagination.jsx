import React, { useState, useEffect, useCallback } from 'react';
import { library, pages } from '../../noGit/algo.js';
import uuid from 'react-uuid';

import Library from '../Library/Library.jsx';
import WordCreator from '../WordCreator/WordCreator.jsx';

const maxPage = 100;

function Pagination() {
  const [words, setWords] = useState([]);
  const [arraysPag, setArraysPag] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [addPages, setAddPages] = useState([]);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const generatedObjectID = uuid();

  let activePageID;

  const fetchApp = (page) => {
    const searchOptions = {
      filters: `pageID:${page}`,
    };

    return library.search('', searchOptions);
  };

  const fetchPages = (page) => {
    const searchOptions = {
      filters: `objectID:${page}`,
    };

    return pages.search('', searchOptions);
  };

  const fetchPagesIndex = (page) => {
    const searchOptions = {
      filters: `pageIndex:${page}`,
    };

    return pages.search('', searchOptions);
  };

  const fetchPagesAsyn = async (pageNumber) => {
    try {
      const result = await fetchPagesIndex(pageNumber);
      const fetchedWords = result.hits;
      activePageID = fetchedWords[0];
    } catch (error) {
      console.error('Ошибка при выполнении запроса в Algolia:', error);
    }
  };

  const fetchData = (page) => {
    const searchOptions = {
      filters: `pageIndex:${page}`,
    };

    return library.search('', searchOptions);
  };

  const fetchDataAsync = async (page, offset) => {
    try {
      const result = await fetchData(page - offset);
      return result.hits;
    } catch (error) {
      console.error('Ошибка при выполнении запроса в Algolia:', error);
      return [];
    }
  };

  const fetchMaxPage = async () => {
    const maxPageIndexResult = await pages.search('', {
      attributesToRetrieve: ['objectID'],
    });
    const maxPageIndexArrays = maxPageIndexResult.hits.map((item) => item.objectID);
    return maxPageIndexArrays;
  };

  useEffect(() => {
    console.log('Компонент монтируется');

    const fetchAllData = async () => {
      try {
        console.log('Запрашиваем данные...');

        await fetchPagesAsyn(currentPage);

        if (activePageID && activePageID.objectID) {
          const [app, pages, one, two, tree, four, five] = await Promise.all([
            fetchApp(activePageID.objectID),
            fetchPages(activePageID.objectID),
            fetchDataAsync(currentPage, 0),
            fetchDataAsync(currentPage, 2),
            fetchDataAsync(currentPage, 6),
            fetchDataAsync(currentPage, 10),
            fetchDataAsync(currentPage, 81),
          ]);
          setWords({
            app: app.hits,
            pages: pages.hits[0],
            one,
            two,
            tree,
            four,
            five,
          });
          console.log('Данные успешно загружены');
          setDataLoaded(true);
        } else {
          console.log(
            'activePageID или activePageID.objectID не определены. Невозможно выполнить запросы данных.',
          );
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    const checkAndAddPage = async () => {
      await fetchAllData();

      const maxPageIndexArrays = await fetchMaxPage();
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

  const handleAddPages = useCallback(
    async (pageNumber) => {
      const i = pageNumber;
      const pageObject = {
        objectID: generatedObjectID,
        pageName: `Leasson ${pageNumber}`,
        pageIndex: i,
        pageList: [i, i + 2, i + 8, i + 18, i + 99],
      };

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
    setWords({
      ...words,
      pages: [],
    });

    await fetchPagesAsyn(pageNumber);
    setCurrentPage(pageNumber);
    await handleAddPages(pageNumber);
  };
  const renderPagination = (handleClick) => {
    const pagesToShow = 20;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(maxPage, startPage + pagesToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => {
      const pageNumber = startPage + index;
      return (
        <div
          key={pageNumber}
          className={`circle ${pageNumber === currentPage ? 'active' : ''}`}
          onClick={() => handleClick(pageNumber)}>
          {pageNumber}
        </div>
      );
    });
  };

  const navigateToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= maxPage) {
      handlePaginationClick(pageNumber);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      navigateToPage(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    navigateToPage(1);
  };

  const goToLastPage = () => {
    navigateToPage(maxPage);
  };
  function isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (Array.isArray(value) && value.length === 0)
    );
  }
  return (
    <>
      {dataLoaded && (
        <div className="go">
          <div className="body">
            {!isEmpty(words.pages) && (
              <>
                <WordCreator
                  words={words.app}
                  currentPage={currentPage}
                  arraysPages={words.pages}
                />
                <Library words={words.one} currentPage={currentPage} arraysPages={words.pages} />
              </>
            )}
            {/* {(currentPage <= 2 && (
              <>
                <Messange
                  messages={messag.one}
                  currentPage={currentPage}
                  arraysPages={messag.pages}
                />
              </>
            )) ||
              (currentPage >= 3 && currentPage <= 8 && (
                <>
                  <Messange
                    messages={messag.two}
                    currentPage={currentPage - 2}
                    arraysPages={messag.pages}
                  />
                  <Messange
                    messages={messag.one}
                    currentPage={currentPage}
                    arraysPages={messag.pages}
                  />
                </>
              )) ||
              (currentPage >= 9 && currentPage <= 18 && (
                <>
                  <Messange messages={messag.tree} currentPage={currentPage - 6} />
                  <Messange messages={messag.two} currentPage={currentPage - 2} />
                  <Messange messages={messag.one} currentPage={currentPage} />
                </>
              )) ||
              (currentPage >= 19 && currentPage <= 99 && (
                <>
                  <Messange messages={messag.four} currentPage={currentPage - 10} />
                  <Messange messages={messag.tree} currentPage={currentPage - 6} />
                  <Messange messages={messag.two} currentPage={currentPage - 2} />
                  <Messange messages={messag.one} currentPage={currentPage} />
                </>
              )) ||
              (currentPage >= 100 && (
                <>
                  <Messange messages={messag.five} currentPage={currentPage - 81} />
                  <Messange messages={messag.four} currentPage={currentPage - 10} />
                  <Messange messages={messag.tree} currentPage={currentPage - 6} />
                  <Messange messages={messag.two} currentPage={currentPage - 2} />
                  <Messange messages={messag.one} currentPage={currentPage} />
                </>
              ))} */}
          </div>
          <div className="container">
            <div className="pagination">
              <button onClick={goToFirstPage}>Перейти к началу</button>
              <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                Предыдущая
              </button>
              {renderPagination(handlePaginationClick)}
              <button onClick={goToNextPage} disabled={currentPage === maxPage}>
                Следующая
              </button>
              <button onClick={goToLastPage}>Перейти к концу</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pagination;
