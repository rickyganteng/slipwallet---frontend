import Layout from "components/layout";
import { useState, useEffect } from "react";
import Navbar from "components/module/Navbar";
import styles from "styles/Home.module.css";
import axiosApiIntances from "utils/axios";
import { authPage } from "middleware/authorizationPage";
import Footer from "components/module/Footer";
import SideLeft from "components/module/SideLeft";
import { useRouter } from "next/router";
import ChartHome from "components/module/Chart";

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

  const resTransaction = await axiosApiIntances
    .get(`/transaction/${data.user_id}`, {
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
  const dataForChart = await axiosApiIntances
    .get(`transaction/day/${data.user_id}`, {
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
     user: res,
     datatransaction: resTransaction,
     databy: dataForChart,
      
    },
     // will be passed to the page component as props
  };
}

export default function Home(props) {

  // console.log(props.datatransaction);
  const router = useRouter();
  const [resTransaction, setTransactionData] = useState(props.datatransaction || []);

  // useEffect(() => {
  //   setTransactionData(props.resTransaction);
  // }, []);
  
  const handleTopup = (event) => {
    event.preventDefault();
    router.push("/topup");
  };

  const handleTransfer = (event) => {
    event.preventDefault();
    router.push("/transfer");
  };

  const redirectHistoryPage = () => {
    event.preventDefault();
    router.push(`/history/${props.user[0].user_id}`);
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
    <Layout title="Home">
      <Navbar user={props.user} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRight}`}>
            <div className="row">
              <div className={`col-12 ${styles.col12}`}>
                <div className={styles.col}>
                  <div className={styles.balance}>
                    <p>Balance</p>
                    {props.user[0].user_balance != 0 ? (
                      <h2>Rp{convertToIdr(props.user[0].user_balance)}</h2>
                    ) : (
                      <h2>Rp0</h2>
                    )}
                    {props.user[0].user_phone ? (
                      <h6>{props.user[0].user_phone}</h6>
                    ) : (
                      <h6>-</h6>
                    )}
                  </div>
                  <div className={styles.button}>
                    <button
                      className={`btn btn-light ${styles.button1}`}
                      onClick={handleTransfer}
                    >
                      <img src="/icon-transfer.png" alt="" />
                      Transfer
                    </button>

                    <button className="btn btn-light" onClick={handleTopup}>
                      <img src="/icon-topup.png" alt="" />
                      Top Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={`row ${styles.row2}`}>
              <div className={`col-7 ${styles.info}`}>
                <ChartHome {...props} />
              </div>
              <div className={`col-4 ${styles.historyMain}`}>
                <div className={styles.history}>
                  <div className={`nav ${styles.nav}`}>
                    <h4>Transaction History</h4>
                    <label
                      className={styles.seeAll}
                      onClick={redirectHistoryPage}
                    >
                      See all
                    </label>
                  </div>

                  {props.datatransaction.length > 0 ? (
                     props.datatransaction.map((item, index) => (
                      <div key={index} className={styles.historyCol}>
                        <div className={styles.myHistory}>
                        {/* {JSON.stringify(item.transaction_sender_id)}
                        {JSON.stringify(item.transaction_receiver_id)} */}
                          <p></p>
                        {/* {item.length > 0 ? (
                          // {item.user[0].user_image ? (
                          <img
                            src={`http://localhost:3004/backend4/api/${props.user[0].user_image}`}
                            alt=""
                          />
                        ) : (
                          <img src="/icon-default.png" alt="" />
                        )} */}
                          <div className={styles.colHistory}>
                            {/* {item} */}
                            <h6>{item.user_name}</h6>
                            <label>{item.transaction_type}</label>
                          </div>
                        </div>
                        {item.transaction_receiver_id ==
                        props.user[0].user_id ? (
                          <h2>+{convertToIdr(item.transaction_amount)}</h2>
                        ) : (
                          <h2 className={styles.minus}>
                            -{convertToIdr(item.transaction_amount)}
                          </h2>
                        )}
                      </div>
                    ))
                  ) : (
                    <h4>No History</h4>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
