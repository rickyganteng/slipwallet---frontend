import { useState } from "react";
import Layout from "../../../components/layout";
import styles from "../../../styles/Pin.module.css";
import { useRouter } from "next/router";
import Cookie, { set } from "js-cookie";
import Image from "next/image";
import axiosApiIntances from "../../../utils/axios";
import Swal from "sweetalert2";
import { authPage } from "../../../middleware/authorizationPage";

// export async function getServerSideProps(context) {
//   await authPage(context);
//   return { props: {} };
// }

export default function Pin() {
  const router = useRouter();
  const [userPin, setUserPin] = useState({});
  const [numIndex] = useState([1, 2, 3, 4, 5, 6]);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const allPin =
      userPin.pin1 +
      userPin.pin2 +
      userPin.pin3 +
      userPin.pin4 +
      userPin.pin5 +
      userPin.pin6;

console.log(allPin);    // proses axios
    axiosApiIntances
      .patch(`user/pin/${Cookie.get("user_id")}`, { userPin: allPin })
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
          confirmButtonText: "Login Now",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/");
          }
        });
      });
  };

  const handleLogin = () => {
    router.push("/login");
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
    <Layout title="Pin">
      <div className={`container-fluid ${styles.container}`}>
        <div className="row">
          <div className={`col-7 ${styles.colLeft}`}>
            <h1>Slipwallet</h1>
            <Image
              src="/img-phone.svg"
              alt="Picture of the author"
              width={500}
              height={350}
            />
            <h2>App that Covering Banking Needs.</h2>
            <p>
              Slipwallet is an application that focussing in banking needs for all
              users in the world. Always updated and always following world
              trends. 5000+ users registered in Slipwallet everyday with worldwide
              users coverage.
            </p>
          </div>
          {isSuccess ? (
            <div className={`col-5 ${styles.colRight}`}>
              <h2>
                Secure Your Account, Your Wallet, and Your Data With 6 Digits
                PIN That You Created Yourself.
              </h2>
              <h6>
                Create 6 digits pin to secure all your money and your data in
                Zwallet app. Keep it secret and don’t tell anyone about your
                Zwallet account password and the PIN.
              </h6>
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
          ) : (
            <div className={`col-5 ${styles.colRight2}`}>
              <img src="/success.png" alt="" />
              <h2>Your PIN Was Successfully Created</h2>
              <h6>
                Your PIN was successfully created and you can now access all the
                features in Zwallet. Login to your new account and start
                exploring!
              </h6>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
