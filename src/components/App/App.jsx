import React, { useState } from 'react';

import Library from '../Library/Library.jsx';
import WordCreator from '../WordCreator/WordCreator.jsx';
import Pagination from './../Pagination/Pagination.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [library, setLibrary] = useState([]);

  function isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  const handlePropsCurrentPage = (newCurrentPage) => {
    setCurrentPage(newCurrentPage);
  };

  const handlePropsLibrary = (newWords) => {
    setLibrary(newWords);
  };

  return (
    <>
      <div className="go">
        <div className="body">
          {!isEmpty(library.pages) && (
            <>
              <WordCreator
                words={library.app}
                currentPage={currentPage}
                arraysPages={library.pages}
              />
              <Library words={library.one} currentPage={currentPage} arraysPages={library.pages} />
            </>
          )}
        </div>
        <Pagination onPropsCurrentPage={handlePropsCurrentPage} onPropsWords={handlePropsLibrary} />
      </div>
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
    </>
  );
}

export default App;
