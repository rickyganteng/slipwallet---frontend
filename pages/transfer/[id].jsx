import { useState } from "react";
import Layout from "components/layout";
import Navbar from "components/module/Navbar";
import styles from "styles/Transfer.module.css";
import axiosApiIntances from "utils/axios";
import Footer from "components/module/Footer";
import SideLeft from "components/module/SideLeft";
import { authPage } from "middleware/authorizationPage";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const data = await authPage(context);
  const { id } = context.query;

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
    props: { receiverData: res, user: resUserById }, // will be passed to the page component as props
  };
}

export default function inputAmount(props) {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSubmit = (b, n) => {
    event.preventDefault();
    router.push(
      `/transfer/confirmation?b=${b}&n=${n}&id=${props.receiverData[0].user_id}`
    );
  };

  const changeTextAmount = (event) => {
    setBalance(parseInt(event.target.value));
  };

  const changeTextNotes = (event) => {
    setNotes(event.target.value);
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
    <Layout title="Trasfer">
      <Navbar {...props} />
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <SideLeft />
          <div className={`col-8 ${styles.sideRight}`}>
            <h5>Transfer Money</h5>
            <div className={styles.inputAmount}>
              <img src="/icon-default.png" alt="" />
              <div className={styles.col}>
                <text>{props.receiverData[0].user_name}</text>
                <label>{props.receiverData[0].user_phone}</label>
              </div>
            </div>
            <h1>
              Type the amount you want to transfer and then press continue to
              the next steps.
            </h1>
            <form onSubmit={() => handleSubmit(balance, notes)}>
              <div className={styles.inputMoney}>
                <input
                  className={styles.number}
                  type="number"
                  placeholder="0.00"
                  required
                  onChange={changeTextAmount}
                />
                <h3>Rp{convertToIdr(props.user[0].user_balance)} Available</h3>
                <input
                  type="text"
                  placeholder="Add some notes"
                  onChange={changeTextNotes}
                />
              </div>
              <div className={styles.button}>
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
