import React, { useState, useEffect } from 'react';
import './App.scss';
import index from './algo';
import Messange from './Massege';
import App from './App';

function Pagination() {
  const [messagesApp, setMessagesApp] = useState([]);
  const [messagesOne, setMessagesOne] = useState([]);
  const [messagesTwo, setMessagesTwo] = useState([]);
  const [messagesTree, setMessagesTree] = useState([]);
  const [messagesFour, setMessagesFour] = useState([]);
  const [messagesFive, setMessagesFive] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchApp = (page) => {
    const searchOptions = {
      filters: `pageID:${page}`,
    };

    return index.search('', searchOptions);
  };
  const fetchData = (page) => {
    const searchOptions = {
      filters: `pageIndex:${page}`,
    };

    return index.search('', searchOptions);
  };

  const fetchMaxPage = () => {
    return index.search('');
  };

  useEffect(() => {
    fetchMaxPage()
      .then((result) => {
        const pageIndexArrays = result.hits.map((item) => item.pageIndex);
        const maxPages = pageIndexArrays.reduce((max, currentPageArray) => {
          const currentPageMax = Math.max(...currentPageArray);
          return currentPageMax > max ? currentPageMax : max;
        }, 0);

        console.log(maxPages); // Выведет максимальное значение из свойства pageIndex
        setTotalPages(maxPages);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia для максимальной страницы:', error);
      });
    fetchData(currentPage)
      .then((result) => {
        const fetchedMessages = result.hits;
        setMessagesOne(fetchedMessages);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia:', error);
      });
    fetchApp(currentPage)
      .then((result) => {
        const fetchedMessage = result.hits;
        setMessagesApp(fetchedMessage);
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

  const renderPagination = () => {
    const pagesToShow = 20;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    const paginationItems = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <div
          key={i}
          className={`circle ${i === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}>
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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="go">
      <div className="body">
        <App messages={messagesApp} currentPage={currentPage === 0 ? 1 : currentPage} />
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
          {renderPagination()}
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Следующая
          </button>
          <button onClick={goToLastPage}>Перейти к концу</button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
