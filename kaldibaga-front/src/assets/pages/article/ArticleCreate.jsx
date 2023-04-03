import React, {useEffect, useRef, useState} from 'react';
import cls from './Article.module.scss';
import useStorage from "../../hooks/useStorage.js";
import storageNames from "../../constants/storageNames.js";
import account from "../../../services/account.js";
import {Navigate} from "react-router-dom";
import article from "../../../services/article.js";
import InputField from "./InputField.jsx";
import ArticlePreview from "./ArticlePreview.jsx";
import login from "../login/Login.jsx";

const ArticleCreate = () => {
    const [preview, setPreview] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const [createSent, setCreateSent] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const imageFieldRef = useRef();

    const keyupHandler = (ev) => {
        if (ev.code === 'Tab') {
            setPreview((prevState)=>!prevState);
        }
    }

    useEffect(()=>{
        window.addEventListener('keyup', keyupHandler);
        return () => {
            window.removeEventListener('keyup', keyupHandler);
        }
    }, [])

    const sendArticle = () => {
        if (!(title||content)) return;

        article.create([response, setResponse], [createSent, setCreateSent], [error, setError],
            title, content);
    }

    useEffect(()=>{
        if (response) {
            if (articleCreateSettings.onSuccessSubmitAlertText) {
                alert(articleCreateSettings.onSuccessSubmitAlertText);
            }
        }
    }, [])

    return (
        <div className={cls.create}>
            <InputField previewState={[preview, setPreview]} linesState={[content, setContent]} titleState={[title, setTitle]}/>
            <ArticlePreview title={title} content={content} openState={[preview, setPreview]}/>
            <div className={cls.other_settings}>
                <input ref={imageFieldRef} type="file" onChange={(e)=>console.log(e)}/>
                <button className={cls.create_button} onClick={sendArticle}>Создать</button>
            </div>
        </div>
    );
};

export default ArticleCreate;