import styles from "../../styles/NavbarFooter.module.css";

function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <label>2020 Slipwallet. All right reserved.</label>
        <div className={styles.sideRight}>
          <label className={styles.number}>085712287514</label>
          <label>contact@slipwallet.com</label>
        </div>
      </footer>
    </>
  );
}

export default Footer;
