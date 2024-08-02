import styles from './categoryCard.module.css';

export default function CategoryCard() {
    return (
        <div className={styles.container}>
            <div className={styles.content} onClick={() => console.log("category clicked")}>
                <div className={styles.imageContainer}>
                    <img className={styles.image} src="/svg/css.svg" alt=""/>
                </div>
                <div className={`${styles.name} sub-heading-2`}>CSS</div>
            </div>
            <div className={styles.background}></div>
        </div>
    );
}