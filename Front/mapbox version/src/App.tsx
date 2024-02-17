import './App.css';
import MarketPlace from "./MarketPlace";
import React from 'react';

import {
  HashRouter as Router, Routes,
  Route, Navigate,
} from "react-router-dom";
import { useEffect } from 'react'
import MainPage from './MainPage';


function App() {

  useEffect(() => {
  });

  return (
    <>
      <div className="App">
        <Router>
          <Routes >
            {/* <Route path="/marketplace" element={
              <MarketPlace />
            } />
            <Route path="/history" element={<History />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/rl" element={<RegisterAndLoginJSX />} /> */}
            <Route path="/" element={<MainPage />} />
          </Routes >
        </Router>
      </div>
    </>
  );
}

export default App;