import React, {useEffect, useState} from 'react';
import cls from './Article.module.scss';
import {Navigate, useParams} from "react-router-dom";
import article from "../../../services/article.js";
import NotFound from "../errors/NotFound.jsx";
import ArticleViewHeader from "./ArticleViewHeader.jsx";
import ArticleViewContent from "./ArticleViewContent.jsx";
import ArticleViewFooter from "./ArticleViewFooter.jsx";

const ArticleView = () => {
    const {id} = useParams();
    const [articleId, setArticleId] = useState(0);
    const [notFound, setNotFound] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [articleData, setArticleData] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    const handleLike = () => {

    }

    const handleDislike = () => {

    }

    useEffect(()=>{
        if (!isNaN(Number(id))) {
            setArticleId(Number(id));
        } else {
            setNotFound(true);
        }
    }, [])

    useEffect(()=>{
        if (articleId) {
            article.view([response, setResponse], [loaded, setLoaded], [error, setError], articleId);
        }
    }, [articleId])

    useEffect(()=>{
        if (error) {
            setNotFound(true);
        }
    }, [error])

    useEffect(()=>{
        if (response) {
            console.warn(response);

            setArticleData(response.data?.article);
        }

    }, [response])

    if (notFound) {
        return (
            <NotFound/>
        )
    } else if (!loaded) {
        return (
            <div>
                Загрузка...
            </div>
        )
    } else if (error) {
        return (
            <p>Ошибка</p>
        )
    }
    else if (articleData) {
        return (
            <div className={cls.view}>
                <ArticleViewHeader title={articleData.title} author_id={articleData.author_id} time_create={articleData.time_create}/>
                <ArticleViewContent content={articleData.content}/>
                <ArticleViewFooter likes={likes} dislikes={dislikes} onLikeClick={handleLike} onDislikeClick={handleDislike}/>
                {/*{JSON.stringify(articleData)}*/}
            </div>
        );
    } else {
        return (
            <div>Неизвестная ошибка</div>
        )
    }
};

export default ArticleView;