import {Link} from "react-router-dom";

import Logo from "../logo/Logo.jsx";

import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.container}>
            <div className="wrapper">
                <div className={styles.topContainer}>
                    <div className={styles.siteAbout}>
                        <Logo/>
                        <p className="paragraph-2">Digitaldastin by Dastin Darmawan</p>
                        <ul className={styles.socialLinks}>
                            <li>
                                <Link className={styles.link} to="/"><img src="/svg/monogram.svg" alt=""/></Link>
                            </li>
                            <li>
                                <Link className={styles.link} to="/"><img src="/svg/twitter.svg" alt=""/></Link>
                            </li>
                            <li>
                                <Link className={styles.link} to="/"><img src="/svg/instagram.svg" alt=""/></Link>
                            </li>
                            <li>
                                <Link className={styles.link} to="/"><img src="/svg/linkedin.svg" alt=""/></Link>
                            </li>
                        </ul>
                    </div>
                    <ul className={styles.navigation}>
                        <li className={styles.navSection}>
                            <div className={styles.navTitle}>Category</div>
                            <ul className={styles.navLinks}>
                                <li><Link className={styles.link} to="/">CSS</Link></li>
                                <li><Link className={styles.link} to="/">Javascript</Link></li>
                                <li><Link className={styles.link} to="/">Tailwind</Link></li>
                                <li><Link className={styles.link} to="/">React JS</Link></li>
                                <li><Link className={styles.link} to="/">More Category</Link></li>
                            </ul>
                        </li>
                        <li className={styles.navSection}>
                            <div className={styles.navTitle}>About me</div>
                            <ul className={styles.navLinks}>
                                <li><Link className={styles.link} to="/">About Me</Link></li>
                                <li><Link className={styles.link} to="/">Projects</Link></li>
                                <li><Link className={styles.link} to="/">Achievement</Link></li>
                            </ul>
                        </li>
                        <li className={styles.navSection}>
                            <div className={styles.navTitle}>Get in touch</div>
                            <ul className={styles.navLinks}>
                                <li><Link className={styles.link} to="/">+62-8XXX-XXX-XX</Link></li>
                                <li><Link className={styles.link} to="/">demo@gmail.com</Link></li>
                            </ul>
                        </li>
                        <li className={styles.navSection}>
                            <div className={styles.navTitle}>Follow us</div>
                            <ul className={styles.navLinks}>
                                <li><Link className={styles.link} to="/">Medium</Link></li>
                                <li><Link className={styles.link} to="/">Instagram</Link></li>
                                <li><Link className={styles.link} to="/">Twitter</Link></li>
                                <li><Link className={styles.link} to="/">Facebook</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className={styles.bottomContainer}>
                    <span>&copy; 2024 Digitaldastin</span>
                    <span>Made With ❤️ Jakarta, Indonesia</span>
                </div>
            </div>
        </footer>
    )
}