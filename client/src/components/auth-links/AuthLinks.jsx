import styles from './authLinks.module.css';
import {Link} from "react-router-dom";
import {useState} from "react";

const AuthLinks = () => {

    const status = "nonauthenticated";

    const [open, setOpen] = useState(false);

    return (
        <>
            {status === "nonauthenticated" ? (
                <div className={styles.container}>
                    <Link className={styles.link} to="/login">Login</Link>
                    <Link className={styles.link} to="/register">Register</Link>
                </div>) : (
                <>
                    <Link to="/write" className={styles.link}>Write</Link>
                    <span className={styles.link}>Logout</span>
                </>
            )}
            <div className={styles.burger} onClick={() => setOpen(!open)}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            {open && (
                <div className={styles.responsiveMenu}>
                    <Link className={styles.cta} to="/">Home</Link>
                    <Link className={styles.cta} to="/">Contact</Link>
                    <Link className={styles.cta} to="/">About Ме</Link>
                    {status === "nonauthenticated" ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/write">Write</Link>
                            <span className={styles.link}>Logout</span>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default AuthLinks;
