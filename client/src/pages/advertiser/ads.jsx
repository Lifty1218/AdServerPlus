import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { RiAdvertisementFill } from "react-icons/ri";

import Modal from "react-modal";
import Heading from "../../common/components/headingIcon";
import { BsZoomIn } from "react-icons/bs";

Modal.setAppElement("#root");

export default function Ads() {
  const classes = useStyles();
  const [ads, setAds] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentAdvertiser = JSON.parse(localStorage.getItem("advertiser"));
  const [modalImgUrl, setModalImgUrl] = useState("");

  useEffect(() => {
    fetchAdvertiser();
  }, []);

  const fetchAdvertiser = async () => {
    const response = await axios.get(
      `http://localhost:5000/advertiser/ads/${currentAdvertiser._id}`
    );
    if (response.data.advertiser.ads.length > 0) {
      setAds(response.data.advertiser.ads);
    }
  };

  const handleImgClick = (imgURL) => {
    setModalImgUrl(imgURL);
    setIsModalOpen(true);
  };

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className={classes.main}>
      <Heading
        text="Your Ads"
        icon={<RiAdvertisementFill />}
        headingStyle={{ marginBottom: "4rem" }}
      />
      {ads ? (
        ads.map((ad, index) => (
          <div key={index} className={classes.adContainerMain}>
            <div
              className={classes.adImgContainer}
              style={{
                backgroundImage: `url("${ad.imageURL}")`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleImgClick(ad.imageURL)}
            >
              <span className={classes.imgZoomIcon}>
                <BsZoomIn />
              </span>
            </div>

            <div key={index} className={classes.adContainer}>
              <h4 style={{ fontSize: "1.6rem", marginBottom: ".4rem" }}>
                {ad.companyName}
              </h4>
              <h5 className={classes.adText1}>{ad.targetCategory}</h5>
              <h5 className={classes.adText1}>
                Ad Type: <span className={classes.adText2}> {ad.type}</span>
              </h5>
              <h5 className={classes.adText1}>
                Ad Size: <span className={classes.adText2}> {ad.size}</span>
              </h5>

              {ad.adSpace.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginTop: "1rem",
                    // justifyContent: "center",
                    padding: "0 1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: "1",
                    }}
                  >
                    <p className={classes.adSpan}>Impressions</p>
                    <p className={classes.adAnalytics}>{ad.impressions}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: "1",
                    }}
                  >
                    <p className={classes.adSpan}>Clicks</p>
                    <p className={classes.adAnalytics}>{ad.clicks}</p>
                  </div>
                </div>
              ) : (
                <p className={classes.adSpan2}>
                  Sit tight, we are finding suitable Publishers for you
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <span style={{ fontSize: "2.5rem", margin: "30vh 0 0" }}>
          You currently have no ads registered.
        </span>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalOverlayClick}
        shouldCloseOnOverlayClick={true}
        className={classes.content}
        overlayClassName={classes.overlay}
      >
        <img
          src={modalImgUrl}
          style={{ transform: "scale(1.5)" }}
          alt="AdImage"
        />
      </Modal>
    </div>
  );
}

const useStyles = createUseStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2.5rem 5%",
  },
  adContainerMain: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: ".5rem",
    padding: "0 4rem 0 0",
    boxShadow: "0 .4rem .8rem rgba(0,0,0,0.2)",
    gap: "4rem",
    transition: "all .2s",
    width: "55rem",
    marginBottom: "4rem",
  },
  adImgContainer: {
    flex: "1",
    backgroundColor: "#eee",
    backgroundSize: "auto",
    backgroundPosition: "left",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    "&:hover span": {
      color: "rgba(255, 255, 255, .8)",
    },
  },
  adContainer: {
    flex: "1",
    margin: "1rem 0",
    padding: "2.5rem 0",
    textAlign: "left",
  },
  adSpan: {
    fontSize: "1.4rem",
    color: "#a3a3a3",
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(57, 62, 70, 0.5)",
    zIndex: "9999",
  },
  imgZoomIcon: {
    color: "transparent",
    fontSize: "4.5rem",
    transition: "all .1s",
  },
  adText1: {
    fontSize: "1.3rem",
    marginBottom: ".2rem",
    color: "#777777",
  },
  adAnalytics: {
    fontSize: "2rem",
  },
  adSpan2: {
    display: "block",
    fontSize: "1.5rem",
    margin: "1rem 0",
  },
});
