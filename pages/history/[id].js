import styles from "styles/History.module.css";
import SideLeft from "components/module/SideLeft";
import Footer from "components/module/Footer";
import Navbar from "components/module/Navbar";
import Layout from "components/layout";
import axiosApiIntances from "utils/axios";

export async function getStaticPaths(context) {
  const users = await axiosApiIntances
    .get("user/users/all-data")
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      return [];
    });
  const paths = users.map((item) => ({
    params: { id: `${item.user_id}` },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const user = await axiosApiIntances
    .get(`user/${context.params.id}`)
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      return {};
    });

  const getTransactionByWeek = await axiosApiIntances
    .get(`transaction/week/${context.params.id}`)
    .then((res) => {
      // console.log(res);
      return res.data.data;
    })
    .catch((err) => {
      return err.response.data.msg;
    });

  const getTransactionByMonth = await axiosApiIntances
    .get(`transaction/month/${context.params.id}`)
    .then((res) => {
      return res.data.data;
      // console.log(res.data.data);
    })
    .catch((err) => {
      return err.response.data.msg;
    });

  return {
    props: {
      user,
      getTransactionByWeek,
      getTransactionByMonth,
    },
  };
}

export default function History(props) {
  console.log(props)
  const { getTransactionByWeek, getTransactionByMonth } = props;
  return (
    <Layout title="History">
      <Navbar user={props.user} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRightMain}`}>
            <div className={styles.sideRight}>
              <h1>Transaction History</h1>
              <div className={styles.thisWeek}>
                <p>This Week</p>
                <div className={styles.byWeek}>
                  {getTransactionByWeek.map((item, index) => (
                    <div key={index} className={styles.historyCol} >
                      <div className={styles.myHistory}>
                        {/* <p>{item.user[0].user_name}</p> */}
                        {item.user.length > 0 ? (
                          // {item.user[0].user_image ? (
                          <img
                            src={`http://localhost:3004/backend4/api/${item.user[0].user_image}`}
                            alt=""
                          />
                        ) : (
                          <img src="/icon-default.png" alt="" />
                        )}
                        <div className={styles.colHistory}>
                          {/* <h6>{item.user[0].user_name}</h6> */}
                          {item.user.length > 0 ? (
                            <h6>{item.user[0].user_name}</h6>
                          ) : (
                            <h1> Top Up</h1>
                          )}
                          <label>{item.transaction_type} </label>
                        </div>
                      </div>
                      {item.transaction_receiver_id == props.user[0].user_id ? (
                        <h2>+{item.transaction_amount}</h2>
                      ) : (
                        <h2 className={styles.minus}>
                          -{item.transaction_amount}
                        </h2>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.thisMonth}>
                <p>This Month</p>

                <div className={styles.byMonth}>
                  {getTransactionByMonth.map((item, index) => (
                    <div className={styles.historyCol} key={index}>
                      <div className={styles.myHistory}>
                        {/* {JSON.stringify(item)} */}
                        {/* {item.user.length > 0 ? (
                          <h1> {item.user[0].user_name}</h1>
                        ) : (
                          <h1> top up </h1>
                        )} */}

                        {/* <p>{item.transaction_id}</p> */}
                        {item.user.length > 0 ? (
                          // {item.user[0].user_image ? (
                          <img
                            src={`http://localhost:3004/backend4/api/${item.user[0].user_image}`}
                            alt=""
                          />
                        ) : (
                          <img src="/icon-default.png" alt="" />
                        )}
                        <div className={styles.colHistory}>
                          {item.user.length > 0 ? (
                            <h6>{item.user[0].user_name}</h6>
                          ) : (
                            <h1> Top Up</h1>
                          )}
                          {/* <h6>{item.user[0].user_name}</h6> */}
                          <label> {item.transaction_type}  </label>
                        </div>
                      </div>
                      {item.transaction_receiver_id == props.user[0].user_id ? (
                        <h2>+{item.transaction_amount}</h2>
                      ) : (
                        <h2 className={styles.minus}>
                          -{item.transaction_amount}
                        </h2>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
