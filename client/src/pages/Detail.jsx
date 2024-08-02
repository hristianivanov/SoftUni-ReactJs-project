import styles from './detailPage.module.css';

function Detail() {
    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.textContainer}>
                    <h1 className={styles.title}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
                    <div className={styles.user}>
                        <div className={styles.userImageContainer}>
                            {/*<image src="/p1.jpeg" alt="" fill className={styles.avatar} />*/}
                        </div>
                        <div className={styles.userTextContainer}>
                            <span className={styles.username}>John Doe</span>
                            <span className={styles.date}>01.01.2024</span>
                        </div>
                    </div>
                    <div className={styles.imageContainer}>
                        {/*<image className={styles.image} src="" alt=""></image>*/}
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.description}>

                    </div>
                    <div className={styles.commentContainer}>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;