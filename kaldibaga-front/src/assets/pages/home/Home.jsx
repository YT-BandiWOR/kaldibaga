import React, {useEffect, useState} from 'react';
import article from "../../../services/article.js";
import cls from "./Home.module.scss";
import ArticleItem from "./ArticleItem.jsx";

const Home = () => {
    const empty_articles = 'Здесь ничего нету =(';

    const [limit, setLimit] = useState(20);
    const [page, setPage] = useState(1);

    const [isLoaded, setIsLoaded] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const [articles, setArticles] = useState([]);
    const [errorText, setErrorText] = useState('');

    useEffect(()=>{
        article.list([response, setResponse], [isLoaded, setIsLoaded], [error, setError],
            page, limit)
    }, [limit, page])

    useEffect(()=>{
        if (response) {
            setArticles(response.data?.articles);
        }
    }, [response])

    useEffect(()=>{
        if (error) {
            console.error(error);
            setErrorText(error.response.data.error);
        }
    }, [error])

    return (
        <div className={cls.home}>
            {
                (articles.length) ?
                    (
                        articles.map((el, id)=>(
                            <ArticleItem key={id} data={el}/>
                        ))
                    )
                    :
                    (
                        <h1 className={cls.empty}>{empty_articles}</h1>
                    )
            }
        </div>
    );
};

export default Home;