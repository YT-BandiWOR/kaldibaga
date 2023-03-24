import React, {useEffect, useState} from 'react';
import cls from '../common/AuthContent.module.scss';
import loginSettings from "../../constants/loginSettings.js";
import account from "../../../services/account.js";
import backEndpoints from "../../constants/backEndpoints.js";
import useCookie from "../../hooks/useCookie.js";
import cookieNames from "../../constants/cookieNames.js";
import useStorage from "../../hooks/useStorage.js";
import storageNames from "../../constants/storageNames.js";
import {Navigate} from "react-router-dom";
import GoLink from "../../components/ux/GoLink.jsx";


const Login = () => {
    const {form_title,login_text,register_text,placeholder_name,placeholder_password} = loginSettings;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authOk, setAuthOk] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [response, setResponse] = useState({});
    const [error, setError] = useState(null);
    const [redirectToAfterAuth, setRedirectToAfterAuth] = useState('/');

    const login = (e) => {
        e.preventDefault();

        account.login([response, setResponse], [isLoaded, setIsLoaded], [error, setError], username, password);
    }

    useEffect(()=>{
        const url_before_auth = useCookie.pop(cookieNames.url_before_auth);
        const registration_username = useCookie.pop(cookieNames.registration_username);
        const registration_password = useCookie.pop(cookieNames.registration_password);

        if (url_before_auth) {
            setRedirectToAfterAuth(url_before_auth);
        }
        if (registration_username && registration_password) {
            setUsername(registration_username);
            setPassword(registration_password);
        }
    }, [])

    useEffect(()=>{
        console.log(response);

        if (response.data) {
            const {accessToken, refreshToken} = response.data;
            useCookie.set(cookieNames.access_token, accessToken, useCookie.getExpTime(accessToken));
            useStorage.set(storageNames.refresh_token, refreshToken, useCookie.getExpTime(refreshToken));
            setUsername('');
            setPassword('');
            setAuthOk(true);
        }
    }, [response])

    useEffect(()=>{
        if (error) {
            setFormError(error.response.data.error);
        }
    }, [error])

    if (authOk) {
        return (
            <Navigate to={redirectToAfterAuth}/>
        )
    }

    else return (
        <div className={cls.auth_content} onSubmit={login}>
            <form className={cls.auth_form}>
                <h1 className={cls.title}>{form_title}</h1>
                <input onChange={e => setUsername(e.target.value)} value={username} className={cls.input_field} type="text" placeholder={placeholder_name}/>
                <input onChange={e => setPassword(e.target.value)} value={password} className={cls.input_field} type="password" placeholder={placeholder_password}/>
                <button className={cls.current_action_btn} type={"submit"}>{login_text}</button>
            </form>
            {
                formError ? (
                    <div className={cls.form_errors}>
                        {formError}
                    </div>
                ) : <div/>
            }
            <div className={cls.special_links}>
                <GoLink to={'/register'} className={cls.other_action_btn}>{register_text}</GoLink>
            </div>
        </div>
    )
};

export default Login;