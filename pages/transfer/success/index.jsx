import SideLeft from "components/module/SideLeft";
import Navbar from "components/module/Navbar";
import Footer from "components/module/Footer";
import styles from "styles/Transfer.module.css";
import Layout from "components/layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authPage } from "middleware/authorizationPage";
import axiosApiIntances from "utils/axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export async function getServerSideProps(context) {
  const data = await authPage(context);
  const { id, n, b, datetime } = context.query;

  const res = await axiosApiIntances
    .get(`/user/${id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
    .then((res) => {
      return res.data.data[0];
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
    props: {
      userReceiver: res,
      user: resUserById,
      balance: b,
      notes: n,
      dateTime: datetime,
    }, // will be passed to the page component as props
  };
}

export default function Success(props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const handleHome = () => {
    router.push("/");
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

  const handleExportPDF = () => {
    const result = {
      amount: convertToIdr(props.balance),
      balanceLeft: convertToIdr(
        parseInt(props.user[0].user_balance) - parseInt(props.balance)
      ),
      dateTime: props.dateTime,
      notes: props.notes,
      receiverName: props.userReceiver.user_name,
      receiverPhone: props.userReceiver.user_phone,
    };
    console.log(result);
    axiosApiIntances
      .post(`transaction/export/${props.user[0].user_id}`, result, {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      })
      .then((res) => {
        window.open(res.data.data.url);
      })
      .catch((err) => {
        return err.response;
      });
  };

  return (
    <>
      <Layout title="Transfer | Success">
        <Navbar {...props} />
        <div className={styles.container}>
          <div className={`row ${styles.row}`}>
            <SideLeft />
            <div className={`col-8 ${styles.sideRight}`}>
              <div className={styles.success}>
                <img src="/success.png" alt="" />
                <h4>Transfer Success</h4>
              </div>
              <div className={styles.details}>
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
                <h5>{props.dateTime}</h5>
                <hr />
                <p>Notes</p>
                <h5>{props.notes}</h5>
                <hr />
                <div className={styles.profile}>
                  <h4>Transfer To</h4>
                  <div className={`col-4 ${styles.profileReceiver}`}>
                    {props.userReceiver.user_image ? (
                      <img
                        src={`http://localhost:3004/backend4/api/${props.userReceiver.user_image}`}
                        alt=""
                      />
                    ) : (
                      <img src="/icon-default.png" alt="" />
                    )}
                    <div>
                      <h5>{props.userReceiver.user_name}</h5>
                      {props.userReceiver.user_phone ? (
                        <h6>{props.userReceiver.user_phone}</h6>
                      ) : (
                        <h6>-</h6>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.button}>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.btn} ${styles.btnPdf}`}
                  onClick={handleExportPDF}
                >
                  Download PDF
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.btn}`}
                  onClick={handleHome}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </Layout>
    </>
  );
}
