import styles from "../../styles/SideLeft.module.css";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function SideLeft() {
  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user_id");
    router.push("/login");
  };

  const handleTransfer = () => {
    router.push("/transfer");
  };

  const handleDashboard = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push(`/profile/${Cookies.get("user_id")}`);
  };

  const handleTopup = () => {
    router.push("/topup");
  };

  return (
    <>
      <div className={`col-3 ${styles.col3}`}>
        <div className={`col-12 ${styles.sideLeft}`}>
          <label onClick={handleDashboard}>
            <div>
              <img src="/icon-dashboard.png" alt="" />
              <text>Dashboard</text>
            </div>
          </label>
          <label onClick={handleTransfer}>
            <div>
              <img src="/icon-transfer.png" alt="" />
              <text>Transfer</text>
            </div>
          </label>
          <label onClick={handleTopup}>
            <div>
              <img src="/icon-topup.png" alt="" />
              <text>Top Up</text>
            </div>
          </label>
          <label onClick={handleProfile}>
            <div>
              <img src="/icon-profile.png" alt="" />
              <text>Profile</text>
            </div>
          </label>
          <section className={styles.logout} onClick={handleLogout}>
            <div>
              <img src="/icon-logout.png" alt="" />
              <text>Logout</text>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default SideLeft;
