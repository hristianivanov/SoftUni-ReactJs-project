import Logo from "../logo/Logo.jsx";
import  styles from "./Header.module.css"

const navigation = [
    {name: 'Home', href: '#'},
    {name: 'Category', href: '#'},
    {name: 'About Me', href: '#'},
    {name: 'Search', href: '#'},
]

export default function Header() {
    return (
        <header className={styles.siteHeader}>
            <Logo/>
            <nav className={styles.mainNav}>
                <ul>
                    {
                        navigation.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href}>
                                        {item.name}
                                    </a>
                                </li>
                            )
                        )
                    }
                </ul>
            </nav>
            <div className={styles.cta}>
                <a className="login" href="#">Login</a>
                <a className="register" href="#">Register</a>
            </div>
        </header>
    )
}