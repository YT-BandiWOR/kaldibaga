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

const Header = () => {
    const isMobile = useMemo(()=>window.innerWidth <= 800, [window.innerWidth]);
    const [menuOpened, setMenuOpened] = useState(false);
    const {elements, logoName, loginText, menuCaption} = headerSettings;
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const storage_account = useStorage.get(storageNames.account);

        if (storage_account) {
            setUser(JSON.parse(storage_account));
        } else {
            account.get([response, setResponse], [isLoaded, setIsLoaded], [error, setError]);
        }
    }, [])

    useEffect(()=>{
        if (response) {
            setUser(response.data);
            useStorage.set(storageNames.account, JSON.stringify(user), useCookie.getExpTime(useStorage.get(storageNames.refresh_token)));
        }
    }, [response])

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