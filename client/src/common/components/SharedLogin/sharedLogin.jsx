import React from "react";
import "./sharedLogin.css";

import { Link, Form } from "react-router-dom";

export default function SharedLogin(props) {
  let key, value;

  const handleInput = (e) => {
    key = e.target.name;
    value = e.target.value;
    props.setUser({ ...props.user, [key]: value });
  };

  return (
    <div className="login-outer-container">
      <div className="login-container">
        <div className="login-heading-container">
          <span className="login-heading"> {props.title} </span>
        </div>

        {props.googleAuthFunc != null && props.facebookAuthFunc != null ? (
          <div className="login-heading-container">
            <span className="login-heading-tertiary"> Sign In With </span>
            <div className="login-btn-container">
              <button
                onClick={props.facebookAuthFunc}
                className="login-btn btn-facebook"
              >
                <i
                  className="fab fa-facebook-square"
                  style={{ marginRight: "1rem", fontSize: 28 }}
                />
                Facebook
              </button>
              <button
                onClick={props.googleAuthFunc}
                className="login-btn btn-google"
              >
                <img
                  src={require("../../../Assets/icon-google.png")}
                  alt="GOOGLE"
                  style={{ marginRight: "1rem" }}
                />
                Google
              </button>
            </div>
          </div>
        ) : null}

        <Form onSubmit={props.func}>
          {props.user.email != null && (
            <>
              <span className="input-text"> Email </span>
              <div className="input-container">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={props.user.email}
                  onChange={handleInput}
                  required
                />
                <span className="input-focus" />
              </div>
            </>
          )}
          {props.user.name != null && (
            <>
              <span className="input-text"> Username </span>
              <div className="input-container">
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={props.user.name}
                  onChange={handleInput}
                  required
                />
                <span className="input-focus" />
              </div>
            </>
          )}
          <span className="input-text"> Password </span>
          {props.signup != null && (
            <a href="#" className="input-text2">
              Forgot?
            </a>
          )}
          <div className="input-container">
            <input
              className="input"
              type="password"
              name="password"
              value={props.user.password}
              onChange={handleInput}
              required
            />
            <span className="input-focus" />
          </div>

          {props.errorText != null && (
            <div className="text-center">
              <span className="text-red-600 text-2xl mb-8 block">
                {props.errorText == "Unauthorized" &&
                  "You entered an incorrect email or password"}
                {props.errorText == "UnauthorizedAdmin" &&
                  "You entered an incorrect username or password"}
                {props.errorText == "UserExistsError" &&
                  "A User with the entered email address already exists"}
              </span>
            </div>
          )}
          {/* {props.login != null && (
            <>
              <span className="input-text"> Confirm Password </span>
              <div className="input-container">
                <input
                  className="input"
                  type="password"
                  name="confirmedPassword"
                  value={props.user.confirmedPassword}
                  onChange={handleInput}
                />
                <span className="input-focus" />
              </div>
            </>
          )} */}
          <button className="login-btn2" type="submit">
            {props.login != null ? "Sign Up" : "Sign In"}
          </button>
        </Form>

        <div className="login-bottom-text">
          {props.signup != null ? (
            <>
              <span className="input-text"> Not a member? </span>
              <Link to={props.signup} className="input-text2">
                Sign up now
              </Link>
            </>
          ) : (
            <>
              <span className="input-text"> Already a member? </span>
              <Link to={props.login} className="input-text2">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
