import { Link } from 'react-router-dom';
import styles from './postCard.module.css';

export default function PostCard({
    title,
    authorName,
    authorImage,
    publishDate,
}) {
    return (
        <article className={styles["post-card"]}>
            <Link to="/">
                <div className={styles["article-image"]}>
                    <img src="img/book.png" alt="" />
                </div>
                <div className={`${styles["article-title"]} sub-heading-2 mt-[25px]`}>Fundamental of javascript</div>
            </Link>


            <div className={styles["article-meta-info"]}>
                <div className={styles["author-image"]}>
                    <img src="img/author.jpg" alt="" />
                </div>
                <div className={styles["meta-text"]}>
                    <span className={`${styles["author"]} paragraph-3`}>Dasteen</span>
                    <div className={`${styles["date-reading-time"]} paragraph-4`}>
                        <div className={styles["date"]}>Jan 10, 2022</div>
                        <div> ∙</div>
                        <div className={styles["reading-time"]}>3 min read</div>
                    </div>
                </div>
            </div>
        </article>
    );
}