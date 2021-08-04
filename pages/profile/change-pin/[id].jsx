import styles from "styles/ChangePin.module.css";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import Navbar from "components/module/Navbar";
import Layout from "components/layout";
import axiosApiIntances from "utils/axios";
import { useState } from "react";
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

export default function pesonalInfo(props) {
  const [userPin, setUserPin] = useState({});
  const [numIndex] = useState([1, 2, 3, 4, 5, 6]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const allPin =
      userPin.pin1 +
      userPin.pin2 +
      userPin.pin3 +
      userPin.pin4 +
      userPin.pin5 +
      userPin.pin6;

    // proses axios
    axiosApiIntances
      .patch(
        `user/pin/${props.user[0].user_id}`,
        { userPin: allPin },
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
        }
      )
      .then(() => {
        Swal.showLoading(Swal.getDenyButton());
      })
      .catch((err) => {
        return err.response.data.msg;
      })
      .finally(() => {
        Swal.fire({
          icon: "success",
          title: "Success Create Pin",
        });
      });
  };

  const changeText = (event) => {
    if (event.target.value) {
      const nextSibling = document.querySelector(
        `input[name='${parseInt(event.target.name, 10) + 1}']`
      );

      if (nextSibling !== null) {
        nextSibling.focus();
      }
    }
    setUserPin({
      ...userPin,
      [`pin${event.target.name}`]: event.target.value,
    });
  };

  return (
    <Layout title="Change PIN">
      <Navbar {...props} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRightMain}`}>
            <div className={styles.sideRight}>
              <h1>Change PIN</h1>
              <p>
                Enter your current 6 digits Zwallet PIN below to continue to the
                next steps.
              </p>
              <form onSubmit={handleSubmit}>
                <div className={`mb-3 ${styles.inputPin}`}>
                  {numIndex.map((item, index) => {
                    return (
                      <input
                        key={index}
                        type="password"
                        className="form-control"
                        name={item}
                        required
                        maxLength="1"
                        onChange={changeText}
                        pattern="[0-9]"
                        title="Can only enter number"
                      ></input>
                    );
                  })}
                </div>
                <button type="submit" className="btn btn-primary">
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
