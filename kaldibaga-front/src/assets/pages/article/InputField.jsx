import React from 'react';
import cls from "./Article.module.scss";

const InputField = ({linesState, previewState, titleState}) => {
    const [value, setValue] = linesState;
    const [preview, setPreview] = previewState;
    const [title, setTitle] = titleState;

    return (
        <div className={cls.article_field}>
            <div className={cls.edit_buttons}>
                <div>
                    <button>Форматирование</button>
                </div>
                <div>
                    <input type="text" placeholder={"Заголовок статьи"} value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div>
                    <button onClick={()=>setPreview(!preview)}>Предпросмотр</button>
                </div>
            </div>
            <textarea name="" id="" cols="30" rows="10" value={value} onChange={(e)=>setValue(e.target.value)}></textarea>
        </div>
    )
};

export default React.memo(InputField);