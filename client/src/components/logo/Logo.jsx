import {Link} from "react-router-dom";

import styles from "./logo.module.css"

export default function Logo() {
  return (
      <Link to="/" className={styles.container}>
        <div className={styles.siteName}>Hristian <span> .Blog</span></div>
      </Link>
  )
}