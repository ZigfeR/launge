function Spellchecking(props) {
  return (
    <>
      <div className="words">
        <div className="words-content">
          <ul>
            {props.props.words.map((word) => (
              <li key={word.objectID}>
                <div>{word.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="words-box">
        <input type="text" className="words-input" placeholder="Enter a word..."></input>
        <button type="submit" className="words-submit">
          Send
        </button>
      </div>
    </>
  );
}

export default Spellchecking;
