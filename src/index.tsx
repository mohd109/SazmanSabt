import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './fonts/Gilroy-Black.ttf';
import './fonts/Gilroy-Bold.ttf';
import './fonts/Gilroy-Heavy.ttf';
import './fonts/Gilroy-Light.ttf';
import './fonts/Gilroy-Medium.ttf';
import './fonts/Gilroy-Regular.ttf';
import './fonts/Gilroy-SemiBold.ttf';
import './fonts/Gilroy-Thin.ttf';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

        <App />
    ,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();