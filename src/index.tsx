import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Footer from "./ReusableComponents/Footer/Footer";
import Privacy from "./Pages/Privacy";
import TopBar from "./ReusableComponents/TopBar/TopBar";
import Home from "./Pages/Home";
import Terms from "./Pages/Terms";
import {Separator} from "./ShadComponents/ui/separator";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <div className={"flex flex-col justify-between min-h-screen gap-5"}>
                <div>
                    <TopBar/>
                    <Separator/>
                </div>
                <div className={"flex flex-grow px-5"}>
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                        <Route path={'/terms'} element={<Terms/>}/>
                        <Route path={'/privacy-policy'} element={<Privacy/>}/>
                    </Routes>
                </div>
                <div>
                    <Separator/>
                    <Footer/>
                </div>
            </div>
        </BrowserRouter>
    </React.StrictMode>
);
