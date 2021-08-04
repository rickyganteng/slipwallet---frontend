import Layout from "components/layout";
import Navbar from "components/module/Navbar";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import styles from "styles/Topup.module.css";
import { authPage } from "middleware/authorizationPage";
import { useState } from "react";
import Cookies from "js-cookie";
import axiosApiIntances from "utils/axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import router from "next/router";
import CurrencyInput from "react-currency-input-field";

export async function getServerSideProps(context) {
  const data = await authPage(context);

  const res = await axiosApiIntances
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
    props: { user: res },
  };
}

export default function TopUp(props) {
  const [balance, setBalance] = useState(0);
  const [show, setShow] = useState(false);
  const [numIndex] = useState([1, 2, 3, 4, 5, 6]);
  const [userPin, setUserPin] = useState({});
  const [showPin, setShowPin] = useState(false);
  const handleClose = () => {
    event.preventDefault();
    setShow(false);
  };
  const handleShow = () => {
    event.preventDefault();
    setShow(true);
  };
  const handleClosePin = () => {
    event.preventDefault();
    setShowPin(false);
  };
  const handleShowPin = () => {
    event.preventDefault();
    setShowPin(true);
  };

  const changeTextAmount = (value) => {
    setBalance(parseInt(value));
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
      handleTopup();
      createTransaction(allPin);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Wrong PIN",
      });
    }
  };

  const createTransaction = (pin) => {
    const setData = {
      transactionAmount: balance,
      transactionStatus: "success",
      transactionMessage: "Top up",
      userPin: pin,
      transactionType: 0,
    };
    axiosApiIntances
      .post(
        `transaction?transactionSenderId=${props.user[0].user_id}&transactionReceiverId=${
          props.user[0].user_id
        }`,
        setData,
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
        alert(err.response.data.msg);
      });
  };

  const handleTopup = () => {
    event.preventDefault();
    axiosApiIntances
      .patch(`user/topup/${Cookies.get("user_id")}`, { userTopup: balance })
      .then(() => {
        Swal.showLoading(Swal.getDenyButton());
        setShow(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.response.data.msg,
        });
      })
      .finally(() => {
        Swal.fire({
          icon: "success",
          title: "Top up successful",
          confirmButtonText: "Back to home",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/");
          }
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
    <Layout title="Top Up">
      <Navbar {...props} />
      <div className={styles.containerMain}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className="col">
            <div className={`${styles.box} shadow pt-4 pb-4 pe-4 ps-5`}>
              <div className={`${styles.miniTitle} mt-3`}>How To Top Up</div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>1</div>
                <div className={`col ${styles.semi}`}>
                  Go to the nearest ATM or you can use E-Banking.
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>2</div>
                <div className={`col ${styles.semi}`}>
                  Type your security number on the ATM or E-Banking.
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>3</div>
                <div className={`col ${styles.semi}`}>
                  Select “Transfer” in the menu.
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>4</div>
                <div className={`col ${styles.semi}`}>
                  Type the virtual account number that we provide you at the
                  top.
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>5</div>
                <div className={`col ${styles.semi}`}>
                  Type the virtual account number that we provide you at the
                  top.
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>6</div>
                <div className={`col ${styles.semi}`}>
                  Read the summary details
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>7</div>
                <div className={`col ${styles.semi}`}>
                  Press transfer / top up
                </div>
              </div>
              <div className="row align-items-center mt-4">
                <div className={`col-1 text-center ${styles.number}`}>8</div>
                <div className={`col ${styles.semi}`}>
                  You can see your money in Slipwallet within 3 hours.
                </div>
                <div className="col-sm-2">
                  <button
                    className={`btn btn-primary ${styles.btnTopup} mt-3 mt-sm-0`}
                    type="button"
                    onClick={handleShow}
                  >
                    Top Up Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Top up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`col-12 ${styles.modalTopup}`}>
            <h4>Your Balance : Rp{convertToIdr(props.user[0].user_balance)}</h4>
            <form onSubmit={handleShowPin}>
              <div className={`mb-3 ${styles.inputAmount}`}>
                <CurrencyInput
                  className={styles.input}
                  placeholder="Input topUp"
                  onValueChange={(value) => changeTextAmount(value)}
                  prefix="Rp"
                  groupSeparator="."
                  required
                />
              </div>
             

              <div className={styles.button}>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.buttonClose}`}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* ============================================================================================================= */}

      <Modal show={showPin} onHide={handleClosePin} centered>
        <Modal.Header>
          <Modal.Title>Enter PIN to Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enter your 6 digits PIN for confirmation to continue transferring
            money.{" "}
          </p>
          <div className={`col-12 ${styles.colRight}`}>
            <form>
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
                  className={`btn btn-primary ${styles.buttonClose}`}
                  onClick={handleClosePin}
                >
                  Cancel
                </button>
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
  );
}
