import React, { useState, useEffect } from 'react';
import './App.scss';
import index from './algo';
import Messange from './Massege';
import App from './App';
const maxPage = 100;

function Pagination() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const searchOptions = {
      filters: `pageID:${currentPage}`,
    };

    index
      .search('', searchOptions)
      .then((result) => {
        const fetchedMessages = result.hits;
        setMessages(fetchedMessages);
        setTotalPages(maxPage);
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса в Algolia:', error);
      });
  }, [currentPage]);

  const renderPagination = () => {
    const pagesToShow = 20; // Количество страниц пагинации, которые вы хотите показывать

    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(maxPage, startPage + pagesToShow - 1);

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
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="go">
      <div className="body">
        <App messages={messages} currentPage={currentPage} />
        {(currentPage <= 2 && (
          <>
            <Messange messages={messages} currentPage={currentPage} />
          </>
        )) ||
          (currentPage >= 3 && currentPage <= 8 && (
            <>
              <Messange messages={messages} currentPage={currentPage - 2} />
              <Messange messages={messages} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 9 && currentPage <= 18 && (
            <>
              <Messange messages={messages} currentPage={currentPage - 6} />
              <Messange messages={messages} currentPage={currentPage - 2} />
              <Messange messages={messages} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 19 && currentPage <= 99 && (
            <>
              <Messange messages={messages} currentPage={currentPage - 10} />
              <Messange messages={messages} currentPage={currentPage - 6} />
              <Messange messages={messages} currentPage={currentPage - 2} />
              <Messange messages={messages} currentPage={currentPage} />
            </>
          )) ||
          (currentPage >= 100 && (
            <>
              <Messange messages={messages} currentPage={currentPage - 81} />
              <Messange messages={messages} currentPage={currentPage - 10} />
              <Messange messages={messages} currentPage={currentPage - 6} />
              <Messange messages={messages} currentPage={currentPage - 2} />
              <Messange messages={messages} currentPage={currentPage} />
            </>
          ))}
      </div>
      <div className="container">
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 0}>
            Предыдущая
          </button>
          {renderPagination()}
          <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
            Следующая
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
