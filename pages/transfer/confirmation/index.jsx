import SideLeft from "components/module/SideLeft";
import Navbar from "components/module/Navbar";
import Footer from "components/module/Footer";
import styles from "styles/Transfer.module.css";
import Layout from "components/layout";
import { Modal, Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { authPage } from "middleware/authorizationPage";
import axiosApiIntances from "utils/axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export async function getServerSideProps(context) {
  const data = await authPage(context);
  const { id, n, b } = context.query;

  const res = await axiosApiIntances
    .get(`/user/${id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      return [];
    });

  const resUserById = await axiosApiIntances
    .get(`/user/${data.user_id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      return [];
    });
  return {
    props: { userReceiver: res, user: resUserById, balance: b, notes: n }, // will be passed to the page component as props
  };
}

export default function Confirmation(props) {
  const router = useRouter();
  const [numIndex] = useState([1, 2, 3, 4, 5, 6]);
  const [userPin, setUserPin] = useState({});
  const [show, setShow] = useState(false);
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth();
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const allPin =
      userPin.pin1 +
      userPin.pin2 +
      userPin.pin3 +
      userPin.pin4 +
      userPin.pin5 +
      userPin.pin6;

    setUserPin({
      userPin: allPin,
    });

    if (props.user[0].user_pin == allPin) {
      updateUserBalance();
      createTransaction(allPin);
      router.push(
        `/transfer/success?b=${props.balance}&n=${props.notes}&id=${props.userReceiver[0].user_id}&datetime=${monthList[month]} ${date}, ${year} - ${hour}:${minutes}`
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Wrong PIN",
      });
    }
  };

  const updateUserBalance = () => {
    axiosApiIntances
      .patch(
        `/user/balance?SenderId=${props.user[0].user_id}&ReceiverId=${props.userReceiver[0].user_id}`,
        { userBalance: props.balance },
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.response.data.msg,
        });
      });
  };

  const createTransaction = (pin) => {
    axiosApiIntances
      .post(
        `transaction?transactionSenderId=${props.user[0].user_id}&transactionReceiverId=${props.userReceiver[0].user_id}`,
        {
          transactionAmount: props.balance,
          transactionStatus: "success",
          transactionMessage: props.notes,
          userPin: pin,
        },
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.response.data.msg,
        });
      });
  };

  const convertToIdr = (number) => {
    let number_string = number.toString(),
      sisa = number_string.length % 3,
      rupiah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      const separator = sisa ? "." : "";
      return (rupiah += separator + ribuan.join("."));
    }
  };

  return (
    <>
      <Layout title="Confirmation">
        <Navbar {...props} />
        <div className={styles.container}>
          <div className={`row ${styles.row}`}>
            <SideLeft />
            <div className={`col-8 ${styles.sideRight}`}>
              <h5>Transfer Money</h5>
              <div className={styles.inputAmount}>
                <img src="/icon-default.png" alt="" />
                <div className={styles.col}>
                  <text>{props.userReceiver[0].user_name}</text>
                  <label>{props.userReceiver[0].user_phone}</label>
                </div>
              </div>
              <div className={styles.details}>
                <h6>Details</h6>
                <p>Amount</p>
                <h5>Rp{convertToIdr(props.balance)}</h5>
                <hr />
                <p>Balance Left</p>
                <h5>
                  Rp
                  {convertToIdr(
                    parseInt(props.user[0].user_balance) -
                      parseInt(props.balance)
                  )}
                </h5>
                <hr />
                <p>Date & time</p>
                <h5>{`${monthList[month]} ${date}, ${year} - ${hour}:${minutes}`}</h5>
                <hr />
                <p>Notes</p>
                <h5>{props.notes}</h5>
                <hr />
              </div>
              <div className={styles.button}>
                <Button
                  className={styles.btn}
                  variant="primary"
                  onClick={handleShow}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Enter PIN to Transfer</Modal.Title>
            <Button variant="light" onClick={handleClose}>
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <p/>
              Enter your 6 digits PIN for confirmation <p/>to continue transferring
              money.{" "}
            <div className={`col-12 ${styles.colRight}`}>
              <form>
            <br/>
            <br/>
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
                <div className={styles.button}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </Layout>
    </>
  );
}
