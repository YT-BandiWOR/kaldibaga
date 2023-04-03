import React, {useEffect, useState} from 'react';
import cls from './Error.module.scss';
import useCookie from "../../hooks/useCookie.js";
import cookieNames from "../../constants/cookieNames.js";
import GoLink from "../../components/ux/GoLink.jsx";

const Page404 = () => {
    const this_page_doesnt_exists = 'Эта страница не существует (возможно удалена), либо была перемещена.'
    const [backUrl, setBackUrl] = useState('/');

    useEffect(()=>{
        const back_url = useCookie.pop(cookieNames.last_url);
        if (back_url) {
            setBackUrl(back_url);
        }
    }, [])

    return (
        <div className={cls.content}>
            <h1 className={cls.error}>404</h1>
            <p className={cls.description}>{this_page_doesnt_exists}</p>
            <GoLink to={backUrl} className={cls.back_link}>Вернуться назад</GoLink>
        </div>
    );
};

export default Page404;