export default function PostCard() {
    return (
        <article className="post-card">
            <div className="article-image">
                <img src="img/book.png" alt=""/>
            </div>
            <div className="article-title sub-heading-2">Fundamental of javascript</div>
            <div className="article-meta-info">
                <div className="author-image">
                    <img src="img/author.jpg" alt=""/>
                </div>
                <div className="meta-text">
                    <span className="author paragraph-3">Dasteen</span>
                    <div className="date-reading-time paragraph-4">
                        <div className="date">Jan 10, 2022</div>
                        <div> ∙</div>
                        <div className="reading-time">3 min read</div>
                    </div>
                </div>
            </div>
        </article>
    );
}