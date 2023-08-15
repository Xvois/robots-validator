import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './CSS/index.css';
import Home from "./TS/Pages/Home";
import TopBar from "./TS/Components/TopBar";
import Terms from "./TS/Pages/Terms";
import Privacy from "./TS/Pages/Privacy";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <TopBar/>
        <div id={'content-wrapper'}>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/terms'} element={<Terms/>}/>
                    <Route path={'/privacy-policy'} element={<Privacy/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    </React.StrictMode>
);
