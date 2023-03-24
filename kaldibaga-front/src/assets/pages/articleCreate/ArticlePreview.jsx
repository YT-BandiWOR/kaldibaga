import cls from "./Article.module.scss";
import ArticleContentViewer from "../../components/ui/articleContentViewer/ArticleContentViewer.jsx";


const ArticlePreview = ({openState, title, content}) => {
    const [open, setOpen] = openState;

    if (open) {
        return (
            <div className={cls.preview}>
                <div className={cls.header}>
                    <h1 className={cls.preview_watermark}>Предпросмотр</h1>
                    <h1 className={cls.article_title}>{title}</h1>
                    <button onClick={()=>setOpen(!open)} className={cls.close_button}>X</button>
                </div>
                <div className={cls.main}>
                    <ArticleContentViewer text={content}/>
                </div>
                <div className={cls.footer}>
                    Примерный вид страницы
                </div>
            </div>
        )
    } else {
        return (
            <div/>
        )
    }
}

export default ArticlePreview;