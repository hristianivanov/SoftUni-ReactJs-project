import {Link} from "react-router-dom";

import Hero from "../../components/hero/Hero.jsx";
import CategoryCard from "../../components/category-card/CategoryCard.jsx";
import PostCard from "../../components/post-card/PostCard.jsx";
import SectionNameAndLink from "../../components/section-name-link/SectionNameAndLink.jsx";

import styles from './homePage.module.css'

export default function Home() {
    return (
        <main className={styles.container}>
            <Hero/>
            <section className={styles.categoryContainer}>
                <img className={styles.scrollButton} src="/svg/scroll.svg" alt=""/>
                <div className={"wrapper"}>
                    <SectionNameAndLink sectionNameText={"Browse The Category"} sectionLinkText={"Category"}/>
                    <div className={styles.categoryList}>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                    </div>
                </div>
            </section>
            <section className={styles.articlesContainer}>
                <div className={`${styles.wrapper} wrapper`}>
                    <div className={styles.content}>
                        <SectionNameAndLink sectionNameText={"Featured Article"} sectionLinkText={"Article"}/>
                        <div className={styles.postCardList}>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <SectionNameAndLink sectionNameText={"Featured Article"} sectionLinkText={"Article"}/>
                        <div className={styles.postCardList}>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                        </div>
                    </div>
                    <Link to="/" className={styles.button}>More Article</Link>
                </div>
            </section>
        </main>
    )
}