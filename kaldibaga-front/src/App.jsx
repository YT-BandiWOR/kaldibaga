import React from 'react';
import cls from './App.module.scss';
import Header from "./assets/components/header/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./assets/pages/home/Home.jsx";
import Footer from "./assets/components/footer/Footer.jsx";
import Login from "./assets/pages/login/Login.jsx";
import Registration from "./assets/pages/registration/Registration.jsx";
import ArticleCreate from "./assets/pages/article/ArticleCreate.jsx";
import NotFound from "./assets/pages/errors/NotFound.jsx";
import ArticleView from "./assets/pages/article/ArticleView.jsx";

const App = () => {
    return (
        <div className={cls.app}>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Registration/>}/>
                <Route path={'/create'} element={<ArticleCreate/>}/>

                <Route path={'/article/:id'} element={<ArticleView/>}/>

                <Route path={'*'} element={<NotFound/>}/>
            </Routes>
            <Footer/>
        </div>
    );
};

export default App;