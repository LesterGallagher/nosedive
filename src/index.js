import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/material-design-icons/iconfont/material-icons.css';
import 'typeface-roboto';
import 'purecss';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


const apiUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:1234' : process.env.REACT_APP_DEV_API_URL;
