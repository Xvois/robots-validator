import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Footer from "./ReusableComponents/Footer/Footer";
import Privacy from "./Pages/Privacy";
import TopBar from "./ReusableComponents/TopBar/TopBar";
import Home from "./Pages/Home";
import Terms from "./Pages/Terms";

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
        <Footer/>
    </React.StrictMode>
);
