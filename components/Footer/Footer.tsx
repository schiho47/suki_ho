import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        &#169;Copyright 2026 Suki Ho. All rights reserved
      </div>
    </div>
  );
};

export default Footer;
