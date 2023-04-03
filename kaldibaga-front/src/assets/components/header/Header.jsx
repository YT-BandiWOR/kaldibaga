import React, {useEffect, useMemo, useState} from 'react';
import cls from './Header.module.scss';
import GoLink from "../ux/GoLink.jsx";
import MobileMenu from "./MobileMenu.jsx";
import LoginLink from "../ux/LoginLink.jsx";
import headerSettings from "../../constants/headerSettings.js";
import account from "../../../services/account.js";
import useStorage from "../../hooks/useStorage.js";
import storageNames from "../../constants/storageNames.js";
import useCookie from "../../hooks/useCookie.js";
import useSession from "../../hooks/useSession.js";
import sessionNames from "../../constants/sessionNames.js";
import authSettings from "../../constants/authSettings.js";
import {Navigate, useNavigate} from "react-router-dom";

const Header = () => {
    const isMobile = window.innerWidth <= 800;
    const [menuOpened, setMenuOpened] = useState(false);
    const {elements, logoName, loginText, menuCaption} = headerSettings;
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [user, setUser] = useState(null);
    const current_page = window.location.pathname;
    const navigate = useNavigate();

    useEffect(()=>{
        if (!user) {
            account.get([response, setResponse], [isLoaded, setIsLoaded], [error, setError]);
        }
    }, [])

    useEffect(()=>{
        if (response) {
            setUser(response.data);
        }
    }, [response])

    useEffect(()=>{
        if (error && (!(authSettings.pagesWithoutAuth.includes(current_page)))) {
            alert(error.response.data.error);
            navigate('/login');
        }
    }, [error])

    if (isMobile) {
        return (
            <>
                <header className={cls.header}>
                    <GoLink to="/" className={cls.logo}>{logoName}</GoLink>
                    <button
                        onClick={()=>setMenuOpened((prevState)=>!prevState)}
                        className={cls.openMenu}
                    >
                        {menuCaption}
                    </button>
                </header>
                <MobileMenu
                    account={user} menuState={[menuOpened, setMenuOpened]} loginText={loginText} elements={elements}
                />
            </>
        )
    } else {
        return (
            <header className={cls.header}>
                <GoLink to="/" className={cls.logo}>{logoName}</GoLink>
                <div className={cls.links}>
                    {
                        elements.map((el,id)=>(
                            <GoLink
                                className={cls.link}
                                key={id}
                                to={el[1]}
                            >{el[0]}</GoLink>
                        ))
                    }
                </div>
                {
                    user ?
                        (
                            <div className={cls.authorized}>
                                <GoLink to="#">{user.username}</GoLink>
                            </div>
                        )
                        :
                        (
                            <div className={cls.non_authorized}>
                                <LoginLink to="/login">{loginText}</LoginLink>
                            </div>
                        )
                }
            </header>
        )
    }
};

export default Header;