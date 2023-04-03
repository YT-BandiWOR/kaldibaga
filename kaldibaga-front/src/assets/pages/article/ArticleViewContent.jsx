import React from 'react';
import ArticleContentViewer from "../../components/ui/articleContentViewer/ArticleContentViewer.jsx";
import cls from "./Article.module.scss";

const ArticleViewContent = ({content}) => {
    return (
        <div className={cls.main}>
            <ArticleContentViewer text={content}/>
        </div>
    );
};

export default React.memo(ArticleViewContent);