import React from 'react';
import cls from "./Article.module.scss";

const ArticleViewHeader = ({author_id, title, time_create}) => {
    return (
        <div className={cls.header}>
            <div className={cls.author}>
                <h2>{author_id}</h2>
            </div>
            <div className={cls.title}>
                <h1>{title}</h1>
            </div>
            <div className={cls.date}>
                {time_create}
            </div>
        </div>
    );
};

export default React.memo(ArticleViewHeader);