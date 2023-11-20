import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import image from "../../assets/success.gif";
import axios from "axios";
import { Link } from "react-router-dom";

let count = 1;

export default function CheckoutSuccess() {
  const classes = useStyles();
  const currentAdvertiser = JSON.parse(localStorage.getItem("advertiser"));

  useEffect(() => {
    console.log("Use Effect");
    paymentSuccess();
  }, []);

  const paymentSuccess = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.product && params.price && params.adId) {
      const adId = params.adId;
      const adResponse = await axios.get(
        `http://localhost:5000/ad/single/${adId}`
      );
      console.log(adResponse.data);
      if (!adResponse.data.pricePlan.success && count == 1) {
        count++;
        // CHANGE SUCCESS TO TRUE IN AD RECORD
        await axios.patch(`http://localhost:5000/ad/${adId}`, {
          "pricePlan.success": true,
        });

        // CREATE A PAYMENT RECORD
        await axios.post("http://localhost:5000/payment/", {
          advertiser: currentAdvertiser._id,
          ad: adId,
          product: params.product,
          amount: params.price.toString() + " $",
        });

        // FIND SUITABLE AD SPACES FOR THE AD
        await axios.get(`http://localhost:5000/ad/find_ad_space/${adId}`);

        console.log("Payment Successful");
      } else {
        console.log("Payment already Complete");
      }
    }
  };

  return (
    <div className={classes.afterSubmissionContainer}>
      <h2 className={classes.bigHeading}>Payment Successful !</h2>
      <img src={image} alt="Success" className={classes.successImg} />
      <p className={classes.text}>
        <span
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "3rem",
            color: "#5b5b5b",
          }}
        >
          Sit back and relax
        </span>
        we will notify you as soon as we find suitable pubisher(s) for you
      </p>
      <p className={classes.smallText}>
        We appreciate your business! If you have any questions, please reach out
        through our
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
    fontSize: "2rem",
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
    width: "40rem",
  },
  smallText: {
    fontSize: "1.6rem",
  },
});
