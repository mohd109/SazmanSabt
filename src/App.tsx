import './App.css';
import MarketPlace from "./MarketPlace";
import React from 'react';
// import RegisterAndLoginJSX from "./RegisterAndLogin";
// import History from "./History";
// import {Home} from "./pages/home";
// import ForgotPassword from './ForgotPassword';

import {
  HashRouter as Router, Routes,
  Route, Navigate,
} from "react-router-dom";
import { useEffect } from 'react'


function App() {

  useEffect(() => {
  });

  return (
    <>
      <div className={"min-h-full min-w-full h-1080px overflow-hidden absolute inset-0 w-full"}>
        <Router>
          <Routes >
            <Route path="/" element={<MarketPlace />} />
          </Routes >
        </Router>
      </div>
    </>
  );
}

export default App;