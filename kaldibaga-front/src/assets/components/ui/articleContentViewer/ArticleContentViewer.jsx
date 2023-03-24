import React, {useMemo} from 'react';
import cls from "./ArticleContentViewer.module.scss"
import formatText from "./formatText.js";
import ContentElement from "./ContentElement.jsx";

const ArticleContentViewer = ({text}) => {
    const content = useMemo(()=>{
        return formatText(text);
    }, [text])

    return (
        <div className={cls.content}>
            {content.map((el, id)=>(
                <ContentElement key={id} data={el}/>
            ))}
        </div>
    );
};

export default ArticleContentViewer;