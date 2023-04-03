import React, {useState} from 'react';
import cls from "./Article.module.scss";

const ArticleViewFooter = ({likes, dislikes, onDislikeClick, onLikeClick}) => {
    const [likeActive, setLikeActive] = useState(false);
    const [dislikeActive, setDislikeActive] = useState(false);

    const handleLike = (e) => {
        if (!likeActive) {
            setLikeActive(true);
        } else {
            setLikeActive(false);
        }

        setDislikeActive(false);
    }

    const handleDislike = (e) => {
        if (!dislikeActive) {
            setDislikeActive(true);
        } else {
            setDislikeActive(false);
        }

        setLikeActive(false);
    }

    return (
        <div className={cls.footer}>
            <div className={cls.score}>
                <div className={likeActive? cls.like_a : cls.like} onClick={handleLike}>
                    {likes}
                </div>
                <div className={dislikeActive? cls.dislike_a : cls.dislike} onClick={handleDislike}>
                    {dislikes}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ArticleViewFooter);