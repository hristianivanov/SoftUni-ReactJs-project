export default function Hero() {
    return (
        <section className="section-hero">
            <div className="wrapper">
                <div className="hero-left">
                    <h1 className="heading-1">Hi, I’m Dasteen Front End Dev</h1>
                    <p className="paragraph-1">
                        On this blog I share tips and tricks, frameworks, projects,
                        tutorials, etc Make sure you subscribe to get the latest updates
                    </p>
                    <div className="search">
                        <input type="text" placeholder="Enter youe email here"/>
                        <a href="#" className="button">Subscribe</a>
                    </div>
                </div>
                <div className="hero-right">
                    <img src="svg/hero.svg" alt=""/>
                </div>
            </div>
        </section>
    );
}