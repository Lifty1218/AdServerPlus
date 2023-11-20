import React from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import Background from "../../assets/homepage1.jpg";

import CustomButton from "../components/Home/button";
import Header from "../components/Home/header";
import ParticleArea from "../components/Home/particleArea";
import About from "../components/Home/about";
import Features from "../components/Home/features";
import Footer from "../components/Home/footer";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

export default function Home() {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <div>
      <Header />

      <div className={classes.mainSection}>
        <ParticleArea />
      </div>

      <div className={classes.mainContent} id="Home">
        <div className={classes.mainContentInner}>
          <h1 className={classes.mainHeading}>AD Server Plus</h1>
          <p className={classes.mainPara}>
            A stage to develop advertisements and grow your income. We provide
            you the perfect platform where you can promote your brand to your
            audience.
          </p>
          <div className={classes.mainBtnContainer}>
            <CustomButton
              text="Become an Advertiser"
              class={classes.mainBtn}
              func={() => navigate("/advertiser/login")}
              icon="user-tie"
            />
            <CustomButton
              text="Become a Publisher"
              class={classes.mainBtn}
              func={() => navigate("/publisher/login")}
              icon="user-pen"
            />
          </div>
        </div>
      </div>

      <About />

      <Features />

      <Footer />
    </div>
  );
}

const useStyles = createUseStyles({
  mainSection: {
    backgroundImage: `url(${Background})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    position: "relative",
    zIndex: -2,
  },
  mainContent: {
    backgroundImage: `linear-gradient(rgba(34, 40, 49, 0.6),rgba(57, 62, 70, 0.6))`,
    flex: 1,
    textAlign: "center",
    position: "absolute",
    top: "9.2rem",
    left: "0",
    height: "100vh",
    width: "100%",
  },
  mainContentInner: {
    margin: "45vh 0",
    transform: "translateY(-50%)",
  },
  mainHeading: {
    color: "#fff",
    fontSize: "5.6rem",
    fontWeight: 400,
    letterSpacing: ".8rem",
    fontFamily: '"montserrat"',
  },
  mainPara: {
    color: "#fff",
    fontSize: "1.8rem",
    fontFamily: '"montserrat"',
    margin: "2rem 30% 0",
  },
  mainBtnContainer: {
    display: "flex",
    marginTop: "3rem",
    justifyContent: "center",
    gap: "4rem",
  },
  mainBtn: {
    fontSize: "1.8rem",
  },
  "@media screen and (max-width: 1200px)": {
    mainPara: { margin: "2rem 26% 0" },
    mainSection: { height: "76vh" },
    mainContent: { height: "76.1vh" },
  },
  "@media screen and (max-width: 900px)": {
    mainPara: { margin: "2rem 22% 0" },
  },
  "@media screen and (max-width: 750px)": {
    mainPara: { margin: "2rem 18% 0" },
    mainContent: { top: "8.4rem" },
  },
  "@media screen and (min-width: 1600px)": {
    mainSection: { height: "90vh" },
    mainContent: { height: "90vh" },
  },
  "@media screen and (min-width: 1921px)": {
    mainPara: { margin: "2rem 33% 0" },
  },
});
