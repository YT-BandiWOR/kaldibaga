import React, {useEffect, useState} from 'react';
import registrationSettings from "../../constants/registrationSettings.js";
import account from "../../../services/account.js";
import {Navigate} from "react-router-dom";
import useCookie from "../../hooks/useCookie.js";
import cookieNames from "../../constants/cookieNames.js";
import cls from "../common/AuthContent.module.scss";
import GoLink from "../../components/ux/GoLink.jsx";

const Registration = () => {
    const {do_register_text,form_title,login_text,passwords_not_equals,placeholder_password,placeholder_repeat_password,placeholder_name,placeholder_email} = registrationSettings;

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [regLoaded, setRegLoaded] = useState(false);
    const [regResponse, setRegResponse] = useState(null);
    const [regError, setRegError] = useState(null);

    const [formError, setFormError] = useState(null);
    const [serverErrors, setServerErrors] = useState([]);

    const [regSuccess, setRegSuccess] = useState(false);

    const register = (e) => {
        e.preventDefault();
        if (password!==repeatPassword) {
            setFormError(passwords_not_equals);
            return;
        }
        setFormError(null);

        account.register([regResponse, setRegResponse], [regLoaded, setRegLoaded], [regError, setRegError], email, username, password);
    }

    useEffect(()=>{
        if (regError) {
            setServerErrors(regError.response.data.errors);

            if (regError.response.data.error) {
                setFormError(regError.response.data.error);
            }
        }
    }, [regError])

    useEffect(()=>{
        if (regResponse) {
            setRegSuccess(true);
        }
    }, [regResponse])

    if (regSuccess) {
        useCookie.set(cookieNames.registration_username, username, 10);
        useCookie.set(cookieNames.registration_password, password, 10);

        return (
            <Navigate to={"/login"}/>
        )
    } else

    return (
        <div className={cls.auth_content}>
            <form className={cls.auth_form} onSubmit={register}>
                <h1 className={cls.title}>{form_title}</h1>
                <input required={true} onChange={e => setEmail(e.target.value)} value={email} className={cls.input_field} type="email" placeholder={placeholder_email}/>
                <input required={true} onChange={e => setUsername(e.target.value)} value={username} className={cls.input_field} type="text" placeholder={placeholder_name}/>
                <input required={true} onChange={e => setPassword(e.target.value)} value={password} className={cls.input_field} type="password" placeholder={placeholder_password}/>
                <input required={true} onChange={e => setRepeatPassword(e.target.value)} value={repeatPassword} className={cls.input_field} type="password" placeholder={placeholder_repeat_password}/>
                <button type={"submit"} className={cls.current_action_btn}>{do_register_text}</button>
            </form>
            {
                formError && (
                    <div className={cls.form_errors}>
                        {formError}
                    </div>
                )
            }

            {
                serverErrors && serverErrors.map((el, id) => (
                    <div className={cls.form_errors} key={id}>
                        <span style={{color: "yellow"}}>{el.param}</span> {el.msg}
                    </div>
                ))
            }

            <div className={cls.special_links}>
                <GoLink to={'/login'} className={cls.other_action_btn}>{login_text}</GoLink>
            </div>
        </div>
    );
};

export default Registration;