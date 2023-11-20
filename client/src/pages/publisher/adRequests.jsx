import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Heading from "../../common/components/headingIcon";
import { BsZoomIn } from "react-icons/bs";
import Button from "../../common/components/button";

Modal.setAppElement("#root");

export default function AdRequests() {
  const classes = useStyles();
  const [adSpaces, setAdSpaces] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState("");
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));

  const [requests, setRequests] = useState(false);

  useEffect(() => {
    fetchPublisher();
  }, []);

  const fetchPublisher = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/publisher/ad_requests/${currentPublisher._id}`
      );
      if (response.data && response.data.length > 0) {
        setAdSpaces(response.data);
        console.log("Hello2");
        response.data.forEach((element) => {
          if (element.requestedAds.length > 0) {
            setRequests(true);
          }
        });
      } else {
        setRequests(true);
      }
    } catch (err) {
      console.log(err);
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

  const handleAccept = async (adSpaceId, adId) => {
    try {
      await axios.patch(`http://localhost:5000/ad_space/${adSpaceId}`, {
        requestedAds: [],
        ad: adId,
      });

      await axios.post(`http://localhost:5000/ad/ad_space/${adId}`, {
        adSpaceId: adSpaceId,
      });
      fetchPublisher();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async (adSpaceId, adId) => {
    try {
      await axios.patch(
        `http://localhost:5000/ad_space/requested_ad/${adSpaceId}`,
        {
          adId: adId,
        }
      );
      fetchPublisher();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.main}>
      <Heading
        text="Ad Placement Requests"
        icon={<MdOutlinePublishedWithChanges />}
        headingStyle={{ marginBottom: "2rem" }}
      />
      <div style={{ marginTop: "2rem" }}>
        {adSpaces ? (
          adSpaces.map(
            (adSpace, index) =>
              (adSpace.requestedAds.length > 0 ||
                index < adSpaces.length - 1) &&
              adSpace.requestedAds.map((ad, index2) => {
                return (
                  <div key={index2} className={classes.adContainerMain}>
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
                      <h4 style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>
                        {ad.companyName}
                      </h4>
                      <h5 className={classes.adText1}>{ad.targetCategory}</h5>
                      <h5 className={classes.adText1}>
                        Ad Type:{" "}
                        <span className={classes.adText2}> {ad.type}</span>
                      </h5>
                      <h5 className={classes.adText1}>
                        Ad Size:{" "}
                        <span className={classes.adText2}> {ad.size}</span>
                      </h5>
                      <h4
                        style={{ fontSize: "1.6rem", margin: "1.4rem 0 .4rem" }}
                      >
                        AD Placement Request For:
                      </h4>
                      <h4 style={{ fontSize: "1.6rem", marginBottom: ".4rem" }}>
                        {adSpace.domain.name}
                      </h4>
                      <h4 style={{ fontSize: "1.4rem", marginBottom: ".4rem" }}>
                        AD Space: {adSpace._id}
                      </h4>
                      <h4 style={{ fontSize: "1.4rem", color: "#777777" }}>
                        Domain: {adSpace.domain.url}
                      </h4>
                    </div>

                    <div className={classes.buttonContainer}>
                      <Button
                        text="Accept"
                        afterIcon={<TiTickOutline />}
                        style={{ backgroundColor: "#14A44D" }}
                        func={() => handleAccept(adSpace._id, ad._id)}
                      />
                      <Button
                        text="Decline"
                        afterIcon={<RxCross2 />}
                        style={{ backgroundColor: "#DC4C64" }}
                        func={() => handleDecline(adSpace._id, ad._id)}
                      />
                    </div>
                  </div>
                );
              })
          )
        ) : (
          <span style={{ fontSize: "2.5rem", margin: "25vh 0 40vh" }}>
            You currently have no ad requests for registered ad Spaces.
          </span>
        )}

        {!requests && (
          <span style={{ fontSize: "2.5rem", margin: "25vh 0 40vh" }}>
            You currently have no ad requests for registered ad Spaces.
          </span>
        )}
      </div>
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
  },
  adContainerMain: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: ".5rem",
    padding: "0 4rem 0 0",
    boxShadow: "0 .4rem .8rem rgba(0,0,0,0.2)",
    gap: "4rem",
    transition: "all .2s",
    width: "80rem",
    marginBottom: "4rem",
  },
  adImgContainer: {
    flex: "1",
    backgroundColor: "#eeeeee",
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
  imgZoomIcon: {
    color: "transparent",
    fontSize: "4.5rem",
    transition: "all .1s",
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
  adText1: {
    fontSize: "1.3rem",
    marginBottom: ".4rem",
    color: "#777777",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    justifyContent: "center",
  },
});
