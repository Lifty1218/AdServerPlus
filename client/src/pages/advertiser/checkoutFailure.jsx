import React from "react";
import { createUseStyles } from "react-jss";
import image from "../../assets/failure4.gif";
import { Link } from "react-router-dom";

export default function CheckoutFailure() {
  const classes = useStyles();
  return (
    <div className={classes.afterSubmissionContainer}>
      <h2 className={classes.bigHeading}>Payment Failed !</h2>
      <img src={image} alt="Success" className={classes.successImg} />
      <p className={classes.text}>
        <span
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "2.5rem",
            color: "#5b5b5b",
          }}
        >
          Oops! Something went wrong with your payment
        </span>
        Please check your payment details or try again later.
      </p>
      <p className={classes.smallText}>
        If you continue to have issues, please reach out through our
        <Link
          to="/advertiser/assistance"
          style={{
            color: "#00ADB5",
            marginLeft: ".5rem",
            textDecoration: "underline",
          }}
        >
          User Assistance
        </Link>
        .
      </p>
    </div>
  );
}

const useStyles = createUseStyles({
  text: {
    fontSize: "1.8rem",
    margin: "2rem 0 2rem",
    textTransform: "uppercase",
    color: "#777777",
  },
  afterSubmissionContainer: {
    alignItems: "center",
    fontSize: "3.2rem",
    textAlign: "center",
    margin: "6rem 10rem",
  },
  bigHeading: {
    fontSize: "4.5rem",
  },
  successImg: {
    width: "35rem",
    margin: "3rem 0 1rem",
  },
  smallText: {
    fontSize: "1.6rem",
  },
});
