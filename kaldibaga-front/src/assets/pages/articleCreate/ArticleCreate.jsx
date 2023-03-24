import React, {useEffect, useState} from 'react';
import cls from './Article.module.scss';
import useStorage from "../../hooks/useStorage.js";
import storageNames from "../../constants/storageNames.js";
import account from "../../../services/account.js";
import {Navigate} from "react-router-dom";
import article from "../../../services/article.js";
import InputField from "./InputField.jsx";
import ArticlePreview from "./ArticlePreview.jsx";

const ArticleCreate = () => {
    const [_, setUser] = useState(null);
    const [accountResponse, __] = useState(null);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [accountError, setAccountError] = useState(null);
    const [doRedirect, setDoRedirect] = useState(false);
    const [preview, setPreview] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const [createSent, setCreateSent] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const storage_account = useStorage.get(storageNames.account);
        if (storage_account) {
            setUser(JSON.parse(storage_account));
        } else {
            account.get([accountResponse, accountResponse], [accountLoaded, setAccountLoaded], [accountError, setAccountError]);
        }

        window.addEventListener('keyup', (ev)=>{
            if (ev.code === 'Escape') {
                setPreview(false);
            } else if (ev.code === 'Backquote') {
                setPreview(true);
            }
        })
    }, [])

    useEffect(()=>{
        if (accountError) {
            setDoRedirect(true);
        }
    }, [accountError])

    const sendArticle = () => {
        if (!(title||content)) return;

        article.create([response, setResponse], [createSent, setCreateSent], [error, setError],
            title, content);
    }

    if (doRedirect) {
        return (
            <Navigate to={'/login'}/>
        )
    } else

    return (
        <div className={cls.create}>
            <InputField previewState={[preview, setPreview]} linesState={[content, setContent]} titleState={[title, setTitle]}/>
            <ArticlePreview title={title} content={content} openState={[preview, setPreview]}/>
            <button className={cls.create_button} onClick={sendArticle}>Создать</button>
        </div>
    );
};

export default ArticleCreate;