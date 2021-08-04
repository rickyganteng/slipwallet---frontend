import { useState } from "react";
import Layout from "components/layout";
import styles from "styles/Register.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import Swal from "sweetalert2";
import { unauthPage } from "middleware/authorizationPage";
import { connect } from "react-redux";
import { register } from "redux/actions/auth";

export async function getServerSideProps(context) {
  await unauthPage(context);
  return { props: {} };
}

function Register(props) {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
  });

  const handleRegister = (event) => {
    event.preventDefault();
    props
      .register(form)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: result.value.data.msg,
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
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

  const handleLogin = () => {
    router.push("/login");
  };

  const changeText = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <Layout title="Register">
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
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter your username"
                  required
                  name="userName"
                  value={form.userName}
                  onChange={(event) => changeText(event)}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter your e-mail"
                  required
                  name="userEmail"
                  value={form.userEmail}
                  onChange={(event) => changeText(event)}
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
                  onChange={(event) => changeText(event)}
                ></input>
              </div>
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
              <h1>
                Already have an account?{" "}
                <label onClick={handleLogin}> Let’s Login</label>{" "}
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

const mapDispatchToProps = { register };

export default connect(mapStateToProps, mapDispatchToProps)(Register);
