import styles from './sectionNameAndLink.module.css';
import {Link} from "react-router-dom";

export default function SectionNameAndLink({
    sectionNameText,
    sectionLinkText
}) {
    return (
        <div className={styles.container}>
            <div className={styles.sectionName}>
                <div className={`sub-heading-1`}>{sectionNameText}</div>
                <img className={styles.line} src="svg/line.svg" alt="" />
            </div>
            <Link to="/" className={styles.link}>
                <div className={`sub-heading-2`}>See All {sectionLinkText}</div>
                <img className={styles.arrow} src="/svg/arrow.svg" alt="" />
            </Link>
        </div>
    );
}