import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/global.css';
import axios from "axios";
axios.defaults.withCredentials = true; // 全局启用 withCredentials，确保发送 cookie
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);