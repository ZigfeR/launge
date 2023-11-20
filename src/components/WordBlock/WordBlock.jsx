import Spellchecking from './Spellchecking/Spellchecking';
import WordCreator from './WordCreator/WordCreator';
import { Link, Route, Routes } from 'react-router-dom';

function WordBlock(props) {
  return (
    <div className="library">
      <div className="library-title">
        <h1>Norvegian</h1>
        <h2>{props.arraysPages.pageName || 'Пусто'}</h2>
        <figure className="avatar avatarEdited">
          <Link to="WordCreator">
            <img
              src="https://uploads.commoninja.com/searchengine/wordpress/language-switcher-for-elementor.png"
              alt="img"
            />
          </Link>
        </figure>
        <figure className="avatar avatarSpelling">
          <Link to="Spellchecking">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ466tCJrc_5MSp_-7oImxSn7zt4PrqLJE5Juy2yPDuO3s5m7ufCSXowrKig6r0zDslx8&usqp=CAU"
              alt="img"
            />
          </Link>
        </figure>
      </div>
      {/* <WordCreator props={props} /> */}
      <Routes>
        <Route path="/WordCreator" element={<WordCreator props={props} />} />
        <Route path="/Spellchecking" element={<Spellchecking props={props} />} />
      </Routes>
    </div>
  );
}

export default WordBlock;
