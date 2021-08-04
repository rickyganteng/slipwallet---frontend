import styles from "styles/ChangePassword.module.css";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import Navbar from "components/module/Navbar";
import Layout from "components/layout";
import axiosApiIntances from "utils/axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { authPage } from "middleware/authorizationPage";

export async function getServerSideProps(context) {
  const data = await authPage(context);
  const { id } = context.query;
  const res = await axiosApiIntances
    .get(`user/${id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      return {};
    });

  return {
    props: { user: res },
  };
}

export default function changePassword(props) {
  const router = useRouter();
  const [userData, setUserData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [hidePassword, setHidePassword] = useState(true);

  const handleHidePassword = () => {
    if (hidePassword === true) {
      setHidePassword(false);
    } else {
      setHidePassword(true);
    }
  };

  const handleChangePassword = () => {
    event.preventDefault();
    axiosApiIntances
      .patch(`user/password/${props.user[0].user_id}`, userData, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success Change Password",
          showCloseButton: true,
          confirmButtonText: "Login back ?",
          confirmButtonColor: "#6379f4",
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.remove("token");
            Cookies.remove("user_id");
            router.push("/login");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.response.data.msg,
        });
      });
  };

  const changePassword = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Layout title="Change Password">
      <Navbar {...props} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRightMain}`}>
            <div className={styles.sideRight}>
              <h1>Change Password</h1>
              <p>
                You must enter your current password and then type your new
                password twice.
              </p>

              <form onSubmit={handleChangePassword}>
                <div>
                  <input
                    type={hidePassword ? "password" : "text"}
                    placeholder="Current assword"
                    name="currentPassword"
                    onChange={(e) => changePassword(e)}
                    value={userData.currentPassword}
                    required
                  />
                  <img
                    src="/icon-eye.png"
                    alt=""
                    onClick={handleHidePassword}
                  />
                </div>
                <div>
                  <input
                    type={hidePassword ? "password" : "text"}
                    placeholder="New password"
                    name="newPassword"
                    onChange={(e) => changePassword(e)}
                    value={userData.newPassword}
                    required
                  />
                  <img
                    src="/icon-eye.png"
                    alt=""
                    onClick={handleHidePassword}
                  />
                </div>
                <div>
                  <input
                    type={hidePassword ? "password" : "text"}
                    placeholder="Repeat new password "
                    name="confirmPassword"
                    onChange={(e) => changePassword(e)}
                    value={userData.confirmPassword}
                    required
                  />
                  <img
                    src="/icon-eye.png"
                    alt=""
                    onClick={handleHidePassword}
                  />
                </div>

                <Button type="submit" variant="light">
                  Change Password
                </Button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
