import Layout from "components/layout";
import Navbar from "components/module/Navbar";
import axiosApiIntances from "utils/axios";
import styles from "styles/Profile.module.css";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import React from "react";
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

export default function Profile(props) {
  const router = useRouter();
  const profile = [
    "Personal Information",
    "Change Password",
    "Change PIN",
    "Logout",
  ];
  const inputOpenFileRef = React.createRef();

  const redirected = (item) => {
    event.preventDefault();
    if (item == "Personal Information") {
      router.push(`/profile/personal-info/${props.user[0].user_id}`);
    }
    if (item == "Change Password") {
      router.push(`/profile/change-password/${props.user[0].user_id}`);
    }
    if (item == "Change PIN") {
      router.push(`/profile/change-pin/${props.user[0].user_id}`);
    }
    if (item == "Logout") {
      Cookies.remove("token");
      Cookies.remove("user_id");
      router.push("/login");
    }
  };

  const changeImage = (event) => {
    const image = event.target.files[0];

    const formData = new FormData();
    formData.append("image", image);

    axiosApiIntances
      .patch(`user/image/${props.user[0].user_id}`, formData, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: err.response.data.msg,
          confirmButtonText: "Ok",
        });
      });
  };

  const deleteImage = () => {
    if (window.confirm("sure you want to delete image ?") === true) {
      axiosApiIntances
        .patch(`user/image/${props.user[0].user_id}`, "", {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          return err.response;
        });
    }
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  return (
    <Layout title="Profile">
      <Navbar {...props} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRight}`}>
            {props.user[0].user_image ? (
              <img
                src={`http://localhost:3004/backend4/api/${props.user[0].user_image}`}
                alt=""
                className={styles.profile}
              />
            ) : (
              <img
                src="/icon-default.png"
                alt="edit"
                className={styles.profile}
              />
            )}
            <div className={styles.rowEdit}>
              <div
                className={styles.edit}
                onChange={(e) => changeImage(e)}
                onClick={showOpenFileDlg}
              >
                <img src="/icon-edit.png" alt="" className={styles.iconEdit} />
                <input
                  ref={inputOpenFileRef}
                  type="file"
                  style={{ display: "none" }}
                />
              </div>
              <img
                src="/iconDelete.png"
                alt=""
                className={styles.iconDelete}
                onClick={deleteImage}
              />
            </div>
            <h2>{props.user[0].user_name}</h2>
            <h5>{props.user[0].user_phone}</h5>
            {profile.map((item, index) => {
              return (
                <div
                  className={styles.info}
                  key={index}
                  onClick={() => redirected(item)}
                >
                  <h2>{item}</h2>
                  <img src="/icon-arrow-left.png" alt="" />
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
