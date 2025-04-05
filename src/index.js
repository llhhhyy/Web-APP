import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/global.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);
root.render(
    <React.StrictMode>
        <BrowserRouter>  {/* 新增包裹层 */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
