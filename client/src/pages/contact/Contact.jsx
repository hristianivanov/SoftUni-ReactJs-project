import usePageTitle from '../../hooks/usePageTitle';
import styles from './contact.module.css';

const links = [
  {
    label: 'Email',
    value: 'hristianivanoww@gmail.com',
    href: 'mailto:hristianivanoww@gmail.com',
  },
  {
    label: 'GitHub',
    value: 'github.com/hristianivanov',
    href: 'https://github.com/hristianivanov',
  },
  {
    label: 'Portfolio',
    value: 'hristianivanov.netlify.app',
    href: 'https://hristianivanov.netlify.app/',
  },
];

export default function Contact() {
  usePageTitle('Contact');

  return (
    <main id="main-content" className={styles.container}>
      <section className={`${styles.wrapper} wrapper`}>
        <p className={styles.eyebrow}>Contact</p>
        <h1 className="heading-1">Let&apos;s connect</h1>
        <p className={`${styles.intro} paragraph-1`}>
          This portfolio project is focused on React, JavaScript, APIs, authentication, and full-stack learning.
          You can reach Hristian Ivanov through the links below.
        </p>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href} className={styles.card}>
              <span>{link.label}</span>
              <a href={link.href}>{link.value}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
