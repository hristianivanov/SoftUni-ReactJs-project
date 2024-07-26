import Hero from "../components/hero/Hero.jsx";
import CategoryCard from "../components/category-card/CategoryCard.jsx";
import PostCard from "../components/post-card/PostCard.jsx";

export default function Home() {
    return (
        <main className="site-main">
            <Hero/>
            <section className="browse-category">
                <div className="wrapper">
                    <div className="section-name-link">
                        <div className="section-name">
                            <div className="sub-heading-1">Browse The Category</div>
                            <img className="line-icon" src="svg/line.svg" alt=""/>
                        </div>
                        <div className="section-link">
                            <div className="sub-heading-2">See All Category</div>
                            <img className="arrow-icon" src="svg/arrow.svg" alt=""/>
                        </div>
                    </div>
                    <div className="categories-list">
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                        <CategoryCard/>
                    </div>
                </div>
            </section>
            <section className="articles">
                <div className="wrapper">
                    <section>
                        <div className="section-name-link">
                            <div className="section-name">
                                <div className="sub-heading-1">Featured Article</div>
                                <img className="line-icon" src="svg/line.svg" alt=""/>
                            </div>
                            <div className="section-link">
                                <div className="sub-heading-2">See All Article</div>
                                <img className="arrow-icon" src="svg/arrow.svg" alt=""/>
                            </div>
                        </div>
                        <div className="section-bundle">
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                        </div>
                    </section>
                    <section>
                        <div className="section-name-link">
                            <div className="section-name">
                                <div className="sub-heading-1">Featured Article</div>
                                <img className="line-icon" src="svg/line.svg" alt=""/>
                            </div>
                            <div className="section-link">
                                <div className="sub-heading-2">See All Article</div>
                                <img className="arrow-icon" src="svg/arrow.svg" alt=""/>
                            </div>
                        </div>
                        <div className="section-bundle">
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                            <PostCard/>
                        </div>
                    </section>
                    <a href="#" className="button">More Article</a>
                </div>
            </section>

        </main>
    )
}