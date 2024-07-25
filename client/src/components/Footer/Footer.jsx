import styles from './Footer.module.css';
import Logo from "../Logo/Logo.jsx";

function Footer() {
  return (
      <footer className={styles.siteFooter}>
          <div className="wrapper">
              <div className={styles.footerHeader}>
                  <div className={styles.siteAbout}>
                      <Logo/>
                      <p className="paragraph-2">Digitaldastin by Dastin Darmawan</p>
                      <ul className={styles.socialLinks}>
                          <li>
                              <a href="#"><img src="svg/monogram.svg" alt=""/></a>
                          </li>
                          <li>
                              <a href="#"><img src="svg/twitter.svg" alt=""/></a>
                          </li>
                          <li>
                              <a href="#"><img src="svg/instagram.svg" alt=""/></a>
                          </li>
                          <li>
                              <a href="#"><img src="svg/linkedin.svg" alt=""/></a>
                          </li>
                      </ul>
                  </div>
                  <ul className={styles.footerNav}>
                      <li className={styles.navSection}>
                          <div className={styles.navTitle}>Category</div>
                          <ul className={styles.navLinks}>
                              <li><a href="#">CSS</a></li>
                              <li><a href="#">Javascript</a></li>
                              <li><a href="#">Tailwind</a></li>
                              <li><a href="#">React JS</a></li>
                              <li><a href="#">More Category</a></li>
                          </ul>
                      </li>
                      <li className={styles.navSection}>
                          <div className={styles.navTitle}>About me</div>
                          <ul className={styles.navLinks}>
                              <li><a href="#">About Me</a></li>
                              <li><a href="#">Projects</a></li>
                              <li><a href="#">Achievement</a></li>
                          </ul>
                      </li>
                      <li className={styles.navSection}>
                          <div className={styles.navTitle}>Get in touch</div>
                          <ul className={styles.navLinks}>
                              <li><a href="#">+62-8XXX-XXX-XX</a></li>
                              <li><a href="#">demo@gmail.com</a></li>
                          </ul>
                      </li>
                      <li className={styles.navSection}>
                          <div className={styles.navTitle}>Follow us</div>
                          <ul className={styles.navLinks}>
                              <li><a href="#">Medium</a></li>
                              <li><a href="#">Instagram</a></li>
                              <li><a href="#">Twitter</a></li>
                              <li><a href="#">Facebook</a></li>
                          </ul>
                      </li>
                  </ul>
              </div>

              <div className={styles.footerBottom}>
                  <span>&copy; 2024 Digitaldastin</span>
                  <span>Made With ❤️ Jakarta, Indonesia</span>
              </div>
          </div>
      </footer>
  )
}

export default Footer
