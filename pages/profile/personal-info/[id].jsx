import styles from "styles/PersonalInfo.module.css";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import Navbar from "components/module/Navbar";
import Layout from "components/layout";
import axiosApiIntances from "utils/axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { authPage } from "middleware/authorizationPage";
import Cookies from "js-cookie";

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

export default function pesonalInfo(props) {
  // const router = useRouter();
  const [data, setData] = useState(props.user[0]);

  const handleUpdateData = () => {
    event.preventDefault();
    const setDataUser = {
      userName: data.user_name,
      userEmail: data.user_email,
      userPhone: data.user_phone,
    };

    axiosApiIntances
      .patch(`/user/profile/${props.user[0].user_id}`, setDataUser, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      })
      .then(() => {
        Swal.showLoading(Swal.getDenyButton());
      })
      .catch((err) => {
        return err.response.data.msg;
      })
      .finally(() => {
        Swal.fire({
          icon: "success",
          title: "Update Success",
          confirmButtonColor: "#6379f4",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      });
  };

  const changeText = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Layout title="Personal Informatin">
      <Navbar {...props} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8`} className={styles.sideRightMain}>
            <div className={styles.sideRight}>
              <h1>Personal Information</h1>
              <p>
                We got your personal information from the sign <p/>up proccess. If
                you want to make changes on <p/>your information, contact our
                support.
              </p>
            <div className={styles.coloumn}>
              <form onSubmit={handleUpdateData}>
              <br/>
              <br/>
               
                <h3>Name</h3>
                <input
                  // className={styles.coloumn}
                  type="text"
                  value={data.user_name}
                  name="user_name"
                  onChange={(event) => changeText(event)}
                />
                <br/>

                <h3>Email</h3>
                <input
                  // className={styles.coloumn}
                  type="email"
                  value={data.user_email}
                  name="user_email"
                  onChange={(event) => changeText(event)}
                />
                <br/>

                <h3>Phone Number</h3>
                <input
                  // className={styles.coloumn}
                  type="text"
                  value={data.user_phone}
                  name="user_phone"
                  onChange={(event) => changeText(event)}
                />

                <Button type="submit" variant="light">
                  Update
                </Button>
              </form>
            </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
