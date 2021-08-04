import { useState } from "react";
import Layout from "components/layout";
import styles from "styles/Login.module.css";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { unauthPage } from "middleware/authorizationPage";
import Image from "next/image";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { login } from "redux/actions/auth";

export async function getServerSideProps(context) {
  await unauthPage(context);
  return { props: {} };
}

function Login(props) {
  const router = useRouter();
  const [form, setForm] = useState({ userEmail: "", userPassword: "" });

  const handleLogin = (event) => {
    event.preventDefault();
    props
      .login(form)
      .then((result) => {
        Cookie.set("token", result.value.data.data.token, {
          expires: 7,
          secure: true,
        });
        Cookie.set("user_id", result.value.data.data.user_id, {
          expires: 7,
          secure: true,
        });
        Cookie.set("refreshToken", result.value.data.data.refreshToken, {
          expires: 7,
          secure: true,
        });
        Swal.fire({
          icon: "success",
          title: result.value.data.msg,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/createpin");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.response.data.msg,
          confirmButtonText: "Ok",
        });
      });
  };

  if (props.auth.isLoading) {
    Swal.showLoading(Swal.getDenyButton());
  }

  const handleRegister = () => {
    router.push("/register");
  };

  const changeText = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Layout title="Login">
      <div className={`container-fluid ${styles.container}`}>
        <div className="row">
          <div className={`col-7 ${styles.colLeft}`}>
            <h1 className={styles.title}>Slipwallet</h1>
            <Image
              src="/img-phone.svg"
              alt="Picture of the author"
              width={500}
              height={350}
            />
            <h2 className={styles.text}>App that Covering Banking Needs.</h2>
            <p className={styles.text1}>
              Slipwallet is an application that focussing in banking needs for all
              users in the world. Always updated and always following world
              trends. 5000+ users registered in Slipwallet everyday with worldwide
              users coverage.
            </p>
          </div>
          <div className={`col-5 ${styles.colRight}`}>
            <h2>
              Start Accessing Banking Needs With All Devices and All Platforms
              With 30.000+ Users
            </h2>
            <h6>
              Transfering money is eassier than ever, you can access Zwallet
              wherever you are. Desktop, laptop, mobile phone? we cover all of
              that for you!
            </h6>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter your e-mail"
                  required
                  name="userEmail"
                  value={form.userEmail}
                  onChange={changeText}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Enter your password"
                  required
                  name="userPassword"
                  value={form.userPassword}
                  onChange={changeText}
                ></input>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.button}`}>
                Login
              </button>
              <h1>
                Don’t have an account?
                <label onClick={handleRegister}>Let’s Sign Up</label>{" "}
              </h1>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = { login };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
