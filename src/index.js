import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import Pagination from './Pagination';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Pagination />
  </Router>,
);
