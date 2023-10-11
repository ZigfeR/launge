import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { library, pages } from './algo';
import Messange from './Massege';
import App from './App';
import uuid from 'react-uuid';

const maxPage = 100;

function Pagination() {
  const [arraysPages, setArraysPages] = useState([]);
  const [arraysPag, setArraysPag] = useState([]);
  const [messagesApp, setMessagesApp] = useState([]);
  const [messagesOne, setMessagesOne] = useState([]);
  const [messagesTwo, setMessagesTwo] = useState([]);
  const [messagesTree, setMessagesTree] = useState([]);
  const [messagesFour, setMessagesFour] = useState([]);
  const [messagesFive, setMessagesFive] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addPages, setAddPages] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
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

  const fetchData = (page) => {
    const searchOptions = {
      filters: `pageIndex:${page}`,
    };

    return library.search('', searchOptions);
  };

  const fetchMaxPage = () => {
    return pages.search('');
  };

  useEffect(() => {
    fetchMaxPage()
      .then((result) => {
        const pageIndexArrays = result.hits.map((item) => item.objectID);

        setArraysPag(pageIndexArrays);

        console.log(pageIndexArrays);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia для масива:', error);
      });

    // fetchMaxPage()
    //   .then((result) => {
    //     const pageIndexArrays = result.hits.map((item) => item.pageIndex);
    //     const maxPages = pageIndexArrays.reduce((max, currentPageArray) => {
    //       const currentPageMax = Math.max(...currentPageArray);
    //       return currentPageMax > max ? currentPageMax : max;
    //     }, 0);

    //     console.log(maxPages); // Выведет максимальное значение из свойства pageIndex
    //     setTotalPages(maxPages);
    //   })
    //   .catch((error) => {
    //     console.error('Ошибка при выполнении запроса в Algolia для максимальной страницы:', error);
    //   });
    fetchApp(currentPage)
      .then((result) => {
        const fetchedMessage = result.hits;
        setMessagesApp(fetchedMessage);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia:', error);
      });

    fetchPages('9a3b30cd-f671-862b-5087-1be843f7ce8b')
      .then((result) => {
        const fetchedPages = result.hits;
        setArraysPages(fetchedPages);
        console.log(fetchedPages);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia:', error);
      });

    fetchData(currentPage)
      .then((result) => {
        const fetchedMessages = result.hits;
        setMessagesOne(fetchedMessages);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia:', error);
      });

    // Fetch data for the second set of messages
    if (currentPage >= 2) {
      fetchData(currentPage - 2)
        .then((result) => {
          const fetchedMessages = result.hits;
          setMessagesTwo(fetchedMessages);
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса в Algolia:', error);
        });
    }
    if (currentPage >= 9) {
      fetchData(currentPage - 6)
        .then((result) => {
          const fetchedMessages = result.hits;
          setMessagesTree(fetchedMessages);
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса в Algolia:', error);
        });
    }
    if (currentPage >= 19) {
      fetchData(currentPage - 10)
        .then((result) => {
          const fetchedMessages = result.hits;
          setMessagesFour(fetchedMessages);
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса в Algolia:', error);
        });
    }
    if (currentPage >= 100) {
      fetchData(currentPage - 81)
        .then((result) => {
          const fetchedMessages = result.hits;
          setMessagesFive(fetchedMessages);
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса в Algolia:', error);
        });
    }
  }, [currentPage]);
  const handleAddPages = useCallback(
    async (pageNumber) => {
      const i = pageNumber;
      const pageObject = {
        objectID: generatedObjectID,
        pageName: `Leasson ${pageNumber}`,
        pageIndex: [i, i + 2, i + 8, i + 18, i + 99],
      };

      try {
        // Проверка существующей записи по objectID

        if (!arraysPag.includes(generatedObjectID)) {
          await pages.saveObject(pageObject);
          console.log(`Новая страница создана с objectID ${generatedObjectID}.`);
          setAddPages([...addPages, pageObject]);
        } else {
          console.log(`Страница с objectID ${generatedObjectID} уже существует.`);
        }
      } catch (error) {
        console.error('Ошибка при добавлении страницы в Algolia:', error);
      }
    },
    [addPages, arraysPag, generatedObjectID],
  );

  const handlePaginationClick = (pageNumber) => {
    handleAddPages(pageNumber);

    setCurrentPage(pageNumber);
  };
  const renderPagination = (handleClick) => {
    const pagesToShow = 20;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(maxPage, startPage + pagesToShow - 1);

    const paginationItems = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <div
          key={i}
          className={`circle ${i === currentPage ? 'active' : ''}`}
          onClick={() => handleClick(i)}>
          {i}
        </div>,
      );
    }
    return paginationItems;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(maxPage);
  };

  return (
    <div className="go">
      <div className="body">
        <App messages={messagesApp} currentPage={currentPage} arraysPages={arraysPages} />
        {(currentPage <= 2 && (
          <>
            <Messange messages={messagesOne} currentPage={currentPage} />
          </>
        )) ||
          (currentPage >= 3 && currentPage <= 8 && (
            <>
              <Messange messages={messagesTwo} currentPage={currentPage - 2} />
              <Messange messages={messagesOne} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 9 && currentPage <= 18 && (
            <>
              <Messange messages={messagesTree} currentPage={currentPage - 6} />
              <Messange messages={messagesTwo} currentPage={currentPage - 2} />
              <Messange messages={messagesOne} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 19 && currentPage <= 99 && (
            <>
              <Messange messages={messagesFour} currentPage={currentPage - 10} />
              <Messange messages={messagesTree} currentPage={currentPage - 6} />
              <Messange messages={messagesTwo} currentPage={currentPage - 2} />
              <Messange messages={messagesOne} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 100 && (
            <>
              <Messange messages={messagesFive} currentPage={currentPage - 81} />
              <Messange messages={messagesFour} currentPage={currentPage - 10} />
              <Messange messages={messagesTree} currentPage={currentPage - 6} />
              <Messange messages={messagesTwo} currentPage={currentPage - 2} />
              <Messange messages={messagesOne} currentPage={currentPage} />
            </>
          ))}
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
  );
}

export default Pagination;
