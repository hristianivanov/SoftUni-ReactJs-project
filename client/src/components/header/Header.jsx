import {Link} from 'react-router-dom'

import AuthLinks from '../auth-links/AuthLinks.jsx';
import Logo from "../logo/Logo.jsx";

import styles from "./header.module.css"

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={`${styles.wrapper} wrapper`}>
                <Logo/>
                <div className={styles.links}>
                    <Link className={styles.link} to="/">Home</Link>
                    <Link className={styles.link} to="/">Contact</Link>
                    <Link className={styles.link} to="/">About Ме</Link>
                    <div className={styles.searchContainer}>
                        <img className={styles.searchIcon} src="/svg/search.svg" alt="" />
                        <div className={styles.link}>Search</div>
                    </div>
                </div>
                <AuthLinks/>
            </div>
        </header>
    )
}