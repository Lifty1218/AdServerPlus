import React from "react";
import { Link, Form } from "react-router-dom";
import { createUseStyles } from "react-jss";

import googleIcon from "../../assets/icon-google.png";
import loginBg from "../../assets/loginBackground.jpg";

export default function SharedLogin(props) {
  let key, value;
  const classes = useStyles();
  const handleInput = (e) => {
    key = e.target.name;
    value = e.target.value;
    props.setUser({ ...props.user, [key]: value });
  };

  return (
    <div className={classes.LoginOuterContainer}>
      <div className={classes.loginContainer}>
        <div className={classes.loginHeadingContainer}>
          <span className={classes.loginHeading}> {props.title} </span>
        </div>

        {props.googleAuthFunc ? (
          <div className={classes.loginHeadingContainer}>
            <span className={classes.loginHeadingTertiary}> Sign In With </span>
            <div className={classes.loginBtnContainer}>
              <button
                onClick={props.googleAuthFunc}
                className={`${classes.loginBtn} ${classes.btnGoogle}`}
              >
                <img
                  src={googleIcon}
                  alt="GOOGLE"
                  style={{ marginRight: ".8rem" }}
                />
                Google
              </button>
            </div>
          </div>
        ) : null}

        <Form onSubmit={props.func}>
          {props.user.email != null && (
            <>
              <span className={classes.inputText}> Email </span>
              <div className={classes.inputContainer}>
                <input
                  className={classes.input}
                  type="email"
                  name="email"
                  value={props.user.email}
                  onChange={handleInput}
                  required
                />
              </div>
            </>
          )}
          {props.user.name != null && (
            <>
              <span className={classes.inputText}> Name </span>
              <div className={classes.inputContainer}>
                <input
                  className={classes.input}
                  type="text"
                  name="name"
                  value={props.user.name}
                  onChange={handleInput}
                  required
                />
              </div>
            </>
          )}
          {props.user.dob != null && (
            <>
              <span className={classes.inputText}> Date of Birth </span>
              <div className={classes.inputContainer}>
                <input
                  className={classes.input}
                  type="date"
                  name="dob"
                  value={props.user.dob}
                  onChange={handleInput}
                  required
                />
              </div>
            </>
          )}
          <span className={classes.inputText}> Password </span>
          <div className={classes.inputContainer}>
            <input
              className={classes.input}
              type="password"
              name="password"
              value={props.user.password}
              onChange={handleInput}
              required
            />
            <span className={classes.inputFocus} />
          </div>
          {props.errorText && (
            <div style={{ textAlign: "center" }}>
              <span className={classes.errorText}>
                {props.errorText == "Unauthorized" &&
                  "You entered an incorrect email or password"}
                {props.errorText == "UnauthorizedAdmin" &&
                  "You entered an incorrect username or password"}
                {props.errorText == "UserExistsError" &&
                  "A User with the entered email address already exists"}
              </span>
            </div>
          )}
          <button className={classes.loginBtn2} type="submit">
            {props.login != null ? "Sign Up" : "Sign In"}
          </button>
        </Form>

        <div className={classes.loginBottomText}>
          {props.signup && (
            <>
              <span className={classes.inputText}> Not a member? </span>
              <Link to={props.signup} className={classes.inputText2}>
                Sign up now
              </Link>
            </>
          )}

          {props.login && (
            <>
              <span className={classes.inputText}> Already a member? </span>
              <Link to={props.login} className={classes.inputText2}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  LoginOuterContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `
    linear-gradient(rgba(34, 40, 49, 0.2),rgba(57, 62, 70, 0.2)),
    url(${loginBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flex: 1,
    height: "100vh",
  },
  loginContainer: {
    padding: "5rem 6rem 3rem",
    backgroundColor: "#fff",
    borderRadius: ".8rem",
    boxShadow: "0 1.6rem 3rem rgba(0, 0, 0, 0.3)",
    width: "45rem",
  },
  loginHeadingContainer: { textAlign: "center" },
  loginHeading: {
    fontFamily: '"Montserrat"',
    display: "block",
    fontSize: "3.4rem",
    fontWeight: "500",
    letterSpacing: "0.1.8rem",
    marginBottom: "3rem",
    paddingBottom: "1.8rem",
    borderBottom: "1px solid #999",
  },
  loginHeadingTertiary: {
    fontSize: "2.5rem",
    color: "#555555",
    display: "block",
    marginBottom: "1.6rem",
  },
  loginBtnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: "3.6rem",
  },
  loginBtn: {
    padding: "1.6rem 3.4rem",
    fontSize: "1.8rem",
    borderRadius: ".8rem",
    boxShadow: "0 .3rem .9rem rgba(0, 0, 0, 0.2)",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    "&:hover": {
      transform: "translateY(-0.2rem)",
      boxShadow: "0 1rem 2rem rgba(0, 0, 0, 0.2)",
    },
    "&:active": {
      transform: "translateY(-0..8rem)",
      boxShadow: "0 .7rem 1.4rem rgba(0, 0, 0, 0.2)",
    },
    "&:not(:last-child)": {
      marginRight: "1.6rem",
    },
  },
  btnGoogle: {
    backgroundColor: "#fff",
    color: "#555555",
  },
  inputText: {
    fontSize: "1.7rem",
    color: "#555555",
    lineHeight: "1.7",
  },
  inputText2: {
    fontSize: "1.7rem",
    color: "#999999",
    marginLeft: "0.1rem",
    textDecoration: "underline",
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: "1.4rem",
  },
  input: {
    color: "#333333",
    fontSize: "1.7rem",
    backgroundColor: "#f7f7f7",
    width: "100%",
    padding: "1.4rem 2rem",
    border: "1px solid #e6e6e6",
    outline: "none",
    borderRadius: ".8rem",
  },
  loginBtn2: {
    padding: "1.6rem 0",
    fontSize: "1.8rem",
    width: "100%",
    borderRadius: ".8rem",
    marginBottom: "4rem",
    marginTop: ".5rem",
    backgroundColor: "#393e46",
    color: "#eee",
    transition: "all 0.2s",
    "&:hover": { backgroundColor: "#00adb5" },
  },
  loginBottomText: { textAlign: "center" },
  errorText: {
    display: "block",
    marginBottom: "1.6rem",
    color: "#DC2626",
    fontSize: "1.4rem",
    lineHeight: "1.6rem",
  },
});
