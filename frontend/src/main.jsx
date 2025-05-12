import "react-quill/dist/quill.snow.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';  // ★ 1. 用 HashRouter
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>       {/* 不需要 basename，# 就把路径隔开了 */}
    <App />
  </Router>
);
