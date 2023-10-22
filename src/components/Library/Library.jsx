import { useState } from 'react';

function Library(props) {
  const page = props.arraysPages.pageIndex;
  const [highlightedItems, setHighlightedItems] = useState([]);

  // Выделение слов в библиотеке
  const toggleHighlight = (wordsId) => {
    if (highlightedItems.includes(wordsId)) {
      setHighlightedItems(highlightedItems.filter((id) => id !== wordsId));
    } else {
      setHighlightedItems([...highlightedItems, wordsId]);
    }
  };

  return (
    <div className="library">
      <div className="library-title">
        <h1>Day</h1>
        <h2>Page {page}</h2>
      </div>
      <div className="words">
        <div className="words-content">
          <ul>
            {props.words.map((message) => (
              <li
                key={message.objectID}
                id={
                  highlightedItems.includes(message.objectID)
                    ? 'highlightedTrue'
                    : 'highlightedFalse'
                }
                onClick={() => toggleHighlight(message.objectID)}>
                {message.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="words-box"></div>
    </div>
  );
}

export default Library;
