import Link from "next/link";
import Image from "next/image";
import styles from "./AboutUsModal.module.css";

export default function AboutUsModal() {
  return (
    <div className={styles.aboutUsContainer}>
      <h2>About us</h2>
      <p>
        This is Ateljé, a project built by Jennie, Andrea and Josefine. With a
        keen eye for interior design, Jennie identified a need for a product
        that can allow people to plan their picture walls at home in a realistic
        3D environment. Thus, Ateljé was born. Josefine and Andrea jumped at the
        chance to build a full-stack solution which allowed us to create a
        product in which we have control over the backend, authentication,
        hosting and the UX experience, all in one. <br /><br /> For five weeks in the
        fall of 2025, we worked hard to build a product that could be used by
        friends, family and strangers on the internet. We are happy to announce
        that we made it! To learn more about us and what the future holds for
        Ateljé, visit the repo and our profiles on Github.
      </p>
      <div className={styles.aboutUsLinksWrapper}>
        <Link
          className={styles.aboutUsLink}
          href="https://github.com/Andreawingardh/atelje"
        >
          The Ateljé repository
          <Image
            className={styles.aboutUsLinkIcon}
            src="icons/arrow-white-icon.svg"
            height={20}
            width={20}
            alt="Icon of an arrow"
          />
        </Link>
      </div>
      <div className={styles.aboutUsLinksWrapper}>
        <Link
          className={styles.aboutUsLink}
          href="https://github.com/Andreawingardh"
        >
          Andrea
          <Image
            className={styles.aboutUsLinkIcon}
            src="icons/arrow-white-icon.svg"
            height={20}
            width={20}
            alt="Icon of an arrow"
          />
        </Link>
        <Link
          className={styles.aboutUsLink}
          href="https://github.com/Jennie-Westerlund"
        >
          Jennie
          <Image
            className={styles.aboutUsLinkIcon}
            src="icons/arrow-white-icon.svg"
            height={20}
            width={20}
            alt="Icon of an arrow"
          />
        </Link>
        <Link className={styles.aboutUsLink} href="https://github.com/JosAhl">
          Josefine
          <Image
            className={styles.aboutUsLinkIcon}
            src="icons/arrow-white-icon.svg"
            height={20}
            width={20}
            alt="Icon of an arrow"
          />
        </Link>
      </div>
    </div>
  );
}
