import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './CSS/index.css';
import Home from "./TS/Components/Home";
import TopBar from "./TS/Components/TopBar";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <TopBar />
      <BrowserRouter>
          <Routes>
              <Route path={'/'} element={<Home />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
