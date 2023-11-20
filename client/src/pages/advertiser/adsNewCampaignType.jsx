import React from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import BannerAdImg from "../../assets/BannerAds.jpg";
import InnerAdImg from "../../assets/InnerAds.jpg";
import SideAdImg from "../../assets/SideAds.jpg";
import { AiOutlineSelect } from "react-icons/ai";
import Heading from "../../common/components/headingIcon";
import { FcAdvertising } from "react-icons/fc";

export default function AdsNewCampaignType() {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Heading
        text="Ad campaign types"
        icon={<FcAdvertising />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "2rem",
          marginTop: "2rem",
        }}
        iconStyle={{ fontSize: "3.2rem" }}
      />
      <h3 className={classes.heading}>
        Select a campaign type
        <AiOutlineSelect style={{ marginLeft: "1.5rem" }} />
      </h3>
      <div className={classes.container}>
        <button
          onClick={() => {
            navigate("main", { state: { adType: "banner" } });
          }}
          className={classes.innerContainer}
        >
          <div
            className={classes.innerImg}
            style={{ backgroundImage: `url('${BannerAdImg}')` }}
          ></div>
          <div className={classes.innerTextContainer}>
            <h4 className={classes.innerHeading}>Banner Ads</h4>
            <p className={classes.innerText}>
              Reach your target audience with advertisements that are displayed
              across the top or bottom of a webpage with varying sizes.
            </p>
          </div>
        </button>
        <button
          onClick={() => {
            navigate("main", { state: { adType: "inner" } });
          }}
          className={classes.innerContainer}
        >
          <div
            className={classes.innerImg}
            style={{ backgroundImage: `url('${InnerAdImg}')` }}
          ></div>
          <div className={classes.innerTextContainer}>
            <h4 className={classes.innerHeading}>Inner Ads</h4>
            <p className={classes.innerText}>
              Reach customers interested in your product or service with inner
              advertisements that appear within the content of a webpage.
            </p>
          </div>
        </button>
        <button
          onClick={() => {
            navigate("main", { state: { adType: "side" } });
          }}
          className={classes.innerContainer}
        >
          <div
            className={classes.innerImg}
            style={{ backgroundImage: `url('${SideAdImg}')` }}
          ></div>
          <div className={classes.innerTextContainer}>
            <h4 className={classes.innerHeading}>Side Ads</h4>
            <p className={classes.innerText}>
              Reach your target audience with advertisements that are displayed
              on the side of a webpage, either vertically or horizontally.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  main: {
    padding: "2.5rem 5%",
  },
  heading: {
    fontSize: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7a7a7a",
  },
  container: {
    marginTop: "6rem",
    display: "flex",
    gap: "5rem",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  innerContainer: {
    flex: "1 0 26rem",
    maxWidth: "36rem",
    backgroundColor: "#fff",
    height: "40vh",
    boxShadow: "0 .8rem 1.6rem rgba(0,0,0,0.2)",
    borderRadius: "1rem",
    transition: "all .3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
      transform: "translateY(-.5rem) scale(1.1) ",
      boxShadow: "0 1rem 2rem rgba(0,0,0,0.3)",
    },
  },
  innerImg: {
    flex: "1.1",
    width: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top",
  },
  innerTextContainer: {
    flex: "1",
    margin: "1rem 2.5rem 2rem",
  },
  innerHeading: {
    fontSize: "1.9rem",
    textTransform: "uppercase",
    margin: "2.5rem 0 2rem",
  },
  innerText: {
    fontSize: "1.4rem",
    lineHeight: "2rem",
  },
});
