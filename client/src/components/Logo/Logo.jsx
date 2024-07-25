import styles from "./Logo.module.css"

function Logo() {
  return (
      <div className={styles.siteLogo}>
        <p className={styles.siteName}>Dasteen <span> .Blog</span></p>
      </div>
  )
}

export default Logo
