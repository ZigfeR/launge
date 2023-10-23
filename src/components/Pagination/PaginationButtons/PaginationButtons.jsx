// Компонент для отображения пагинации
function PaginationButtons({ currentPage, maxPage, onPageChange }) {
  const pagesToShow = 20;
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(maxPage, startPage + pagesToShow - 1);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= maxPage) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageClick(1)}>Перейти к началу</button>
      <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
        Предыдущая
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const pageNumber = startPage + index;
        return (
          <div
            key={pageNumber}
            className={`circle ${pageNumber === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(pageNumber)}>
            {pageNumber}
          </div>
        );
      })}
      <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === maxPage}>
        Следующая
      </button>
      <button onClick={() => handlePageClick(maxPage)}>Перейти к концу</button>
    </div>
  );
}

export default PaginationButtons;
