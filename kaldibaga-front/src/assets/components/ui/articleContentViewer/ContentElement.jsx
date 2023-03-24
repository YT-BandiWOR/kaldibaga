import cls from "./ArticleContentViewer.module.scss";
import React from "react";
import ContentLine from "./ContentLine.jsx";

const ContentElement = ({data}) => {
    let className;
    switch (data.type) {
        case 'text': className = cls.text; break;
        case 'title': className = cls.title; break;
        case 'p': className = cls.paragraph; break;
        case 'q': className = cls.quote; break;
        case 'r': className = cls.red; break;
        case 'g': className = cls.green; break;
        case 'b': className = cls.blue; break;
        case 'y': className = cls.yellow; break;
        case 'hr': className = cls.hr; break;
        default: className = '';
    }

    const text = (function (_data) {
        let array = _data.text.split('\n');
        let normalized_array = [];
        let spaces_counter = 0;
        let isStart = true;
        array.forEach((el)=>{
            if (el.replaceAll(' ', '') === '') {
                spaces_counter += 1;
                if (spaces_counter <= 2 && !isStart) {
                    normalized_array.push('');
                }
            } else {
                spaces_counter = 0;
                isStart = false;
                normalized_array.push(el);
            }
        })

        if (normalized_array.length > 0 && normalized_array[0].replaceAll(" ", '') === '') {
            return [];
        }

        return normalized_array;
    }(data))


    if (text.length || data.type === 'hr') {
        return (
            <div className={className}>
                {
                    text.map((el, id)=>(
                        <ContentLine text={el} key={id}/>
                    ))
                }
            </div>
        )
    }
    else {
        return (
            <div/>
        )
    }
}

export default ContentElement;