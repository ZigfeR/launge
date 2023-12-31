import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App/App';
import './index.scss';

const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
