import styles from './hero.module.css';

export default function Hero() {
    return (
        <section className={styles.container}>
            <div className={`wrapper ${styles.wrapper}`}>
                <div className={styles.textContainer}>
                    <h1 className={`${styles.heading} heading-1`}>Hi, I’m Dasteen Front End Dev</h1>
                    <div className={`${styles.subheading} paragraph-1`}>
                        On this blog I share tips and tricks, frameworks, projects,
                        tutorials, etc Make sure you subscribe to get the latest updates
                    </div>
                    <div className={styles.search}>
                        <input className={styles.input} type="text" placeholder="Enter your email here"/>
                        <a href="#" className={styles.button}>Subscribe</a>
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <img src="/svg/hero.svg" alt=""/>
                </div>
            </div>
        </section>
    );
}