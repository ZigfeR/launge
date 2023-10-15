import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { library, pages } from './algo';
import Messange from './Massege';
import App from './App';
import uuid from 'react-uuid';

const maxPage = 100;

function Pagination() {
  // const [arraysPages, setArraysPages] = useState([]);
  const [arraysPag, setArraysPag] = useState([]);
  // const [messagesApp, setMessagesApp] = useState([]);
  // const [messagesOne, setMessagesOne] = useState([]);
  // const [messagesTwo, setMessagesTwo] = useState([]);
  // const [messagesTree, setMessagesTree] = useState([]);
  // const [messagesFour, setMessagesFour] = useState([]);
  const [messag, setMessages] = useState([]);
  // const [messagesFive, setMessagesFive] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [addPages, setAddPages] = useState([]);
  const [isRequestSent, setIsRequestSent] = useState(false);
  // const [totalPages, setTotalPages] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const generatedObjectID = uuid();

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
  let more;
  const fetchPagesAsyn = async (pageNumber) => {
    try {
      const result = await fetchPagesIndex(pageNumber);
      const fetchedMessages = result.hits;
      // setMessagesOne(fetchedMessages[0]);
      more = fetchedMessages[0];
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

        if (more && more.objectID) {
          const [app, pages, one, two, tree, four, five] = await Promise.all([
            fetchApp(more.objectID),
            fetchPages(more.objectID),
            fetchDataAsync(currentPage, 0),
            fetchDataAsync(currentPage, 2),
            fetchDataAsync(currentPage, 6),
            fetchDataAsync(currentPage, 10),
            fetchDataAsync(currentPage, 81),
          ]);
          setMessages({
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
          console.log('more или more.objectID не определены. Невозможно выполнить запросы данных.');
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

      // console.log(`Страница с ${messagesOne.pageIndex} .`);
      // console.log(`Страница с ${messag} .`);
      try {
        if (more && more.pageIndex !== undefined) {
          // Проверка существующей записи по objectID

          if (arraysPag.includes(more.objectID)) {
            console.log(`Страница с objectID ${more.objectID} уже существует.`);
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
    await fetchPagesAsyn(pageNumber);
    setCurrentPage(pageNumber);
    await handleAddPages(pageNumber);
    console.log(`Страница с ${messag} .`);
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

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePaginationClick(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      handlePaginationClick(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    handlePaginationClick(1);
  };

  const goToLastPage = () => {
    handlePaginationClick(maxPage);
  };

  return (
    <>
      {dataLoaded && (
        <div className="go">
          <div className="body">
            <App messages={messag.app} currentPage={currentPage} arraysPages={messag.pages} />
            {messag.one ? (
              <>
                <Messange
                  messages={messag.one}
                  currentPage={currentPage}
                  arraysPages={messag.pages}
                />
              </>
            ) : (
              <p>Нет данных для отображения</p>
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
