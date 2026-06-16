import styles from './hero.module.css';

export default function Hero() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className={styles.container}>
      <div className={`wrapper ${styles.wrapper}`}>
        <div className={styles.textContainer}>
          <h1 className={`${styles.heading} heading-1`}>Hi, I&apos;m Hristian, a Software Developer</h1>
          <p className={`${styles.subheading} paragraph-1`}>
            I write about React, JavaScript, APIs, and full-stack learning while turning course projects
            into usable applications.
          </p>
          <form className={styles.search} onSubmit={handleSubmit}>
            <label className={styles.srOnly} htmlFor="subscription-email">Email address</label>
            <input
              id="subscription-email"
              className={styles.input}
              type="email"
              placeholder="Enter your email here"
            />
            <button className={styles.button} type="submit">Subscribe</button>
          </form>
        </div>
        <div className={styles.imageContainer}>
          <img src="/svg/hero.svg" alt="Developer working on a laptop" />
        </div>
      </div>
    </section>
  );
}
