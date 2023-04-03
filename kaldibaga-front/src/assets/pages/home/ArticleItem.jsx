import React from 'react';
import cls from "./Home.module.scss";
import GoLink from "../../components/ux/GoLink.jsx";
import ArticleContentViewer from "../../components/ui/articleContentViewer/ArticleContentViewer.jsx";

const ArticleItem = ({data}) => {
    const {id, title, content, time_create, author_id} = data;
    const time_create_formatted = new Date(time_create).toDateString();

    return (
        <div className={cls.article}>
            <div className={cls.header}>
                <div/>
                <div className={cls.title}>
                    <h1>{title}</h1>
                </div>
                <div className={cls.time_create}>
                    {time_create_formatted}
                </div>
            </div>
            <div className={cls.main}>
                <ArticleContentViewer text={content}/>
            </div>
            <div className={cls.footer}>
                <GoLink to={`/article/${id}`} className={cls.view_button}>Смотреть</GoLink>
            </div>
        </div>
    );
};

export default React.memo(ArticleItem);