import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { RiAdvertisementFill } from "react-icons/ri";

import Heading from "../../common/components/headingIcon";
import { FaCopy } from "react-icons/fa";
import { capitalize } from "lodash";

export default function Ads() {
  const classes = useStyles();
  const [adSpaces, setAdSpaces] = useState(null);
  const [clipboardText, setClipboardText] = useState("");
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));

  useEffect(() => {
    fetchPublisher();
  }, []);

  const fetchPublisher = async () => {
    const response = await axios.get(
      `http://localhost:5000/publisher/ad_space/${currentPublisher._id}`
    );
    if (response.data && response.data.length > 0) {
      setAdSpaces(response.data);
    }
  };

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);

    // setIsCopied(true);
    // setTimeout(() => setIsCopied(false), 3000);

    // navigator.clipboard.readText().then((text) => {
    //   setClipboardText(text);
    // });
    setClipboardText(text);
  };

  return (
    <div className={classes.main}>
      <Heading
        text="Your Ad Spaces"
        icon={<RiAdvertisementFill />}
        headingStyle={{ marginBottom: "2rem" }}
      />
      <div style={{ marginTop: "2rem" }}>
        {adSpaces ? (
          adSpaces.map((adSpace, index) => (
            <div key={index} className={classes.adContainer}>
              <h4 style={{ fontSize: "2rem", marginBottom: ".3rem" }}>
                AdSpace: {adSpace._id}
              </h4>

              <h5
                style={{
                  fontSize: "1.8rem",
                  marginBottom: ".7rem",
                  color: "#3f3f3f",
                }}
              >
                {adSpace.domain.name}
              </h5>

              <h5
                style={{
                  fontSize: "1.4rem",
                  marginBottom: ".5rem",
                }}
              >
                Domain URL:
                <span className={classes.adText}>{adSpace.domain.url}</span>
              </h5>

              <h5
                style={{
                  fontSize: "1.4rem",
                  marginBottom: ".5rem",
                }}
              >
                Category:
                <span className={classes.adText}>
                  {adSpace.domain.category}
                </span>
              </h5>

              <h5
                style={{
                  fontSize: "1.4rem",
                  marginBottom: ".5rem",
                }}
              >
                Ad Space Type:
                <span className={classes.adText}>
                  {capitalize(adSpace.adType)} Ad
                </span>
              </h5>
              <h5
                style={{
                  fontSize: "1.4rem",
                  marginBottom: ".5rem",
                }}
              >
                Ad Space Size:
                <span className={classes.adText}>{adSpace.adSize} px</span>
              </h5>

              <div>
                <h5
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: ".5rem",
                  }}
                >
                  Ad Space Tag:
                </h5>
                <div className={classes.scriptContainer}>
                  <h5 className={classes.script}>{adSpace.adContainer}</h5>
                  <button
                    onClick={() => handleCopyClick(adSpace.adContainer)}
                    className={classes.scriptBtn}
                  >
                    <FaCopy />
                    {clipboardText == adSpace.adContainer ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <h5
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: ".5rem",
                    marginTop: "1.5rem",
                  }}
                >
                  Script Tag:
                </h5>
                <div className={classes.scriptContainer}>
                  <h5 className={classes.script}>{adSpace.scriptTag}</h5>
                  <button
                    onClick={() => handleCopyClick(adSpace.scriptTag)}
                    className={classes.scriptBtn}
                  >
                    <FaCopy />
                    {clipboardText == adSpace.scriptTag ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              {adSpace.requestedAds.length > 0 ? (
                <span className={classes.adSpan}>
                  Requests for Ad Placements:
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      marginLeft: ".4rem",
                    }}
                  >
                    {adSpace.requestedAds.length}
                  </span>
                </span>
              ) : (
                <span className={classes.adSpan}>
                  No requests for Ad Placements.
                </span>
              )}
            </div>
          ))
        ) : (
          <span style={{ fontSize: "2.5rem", margin: "25vh 0 40vh" }}>
            You currently have no ad spaces registered in any domain.
          </span>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  adContainer: {
    margin: "2rem 0 3rem",
    padding: "3rem 6rem",
    backgroundColor: "#fff",
    textAlign: "left",
    borderRadius: ".5rem",
    boxShadow: "0 .3rem .8rem rgba(0,0,0,0.2)",
  },
  adSpan: {
    fontSize: "1.4rem",
    color: "#a3a3a3",
  },
  scriptContainer: {
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    gap: "2rem",
    border: "1px solid #eee",
    padding: ".5rem 2rem",
    marginBottom: "1rem",
  },
  script: {
    flex: "1",
    color: "#777777",
    fontSize: "1.4rem",
  },
  scriptBtn: {
    backgroundColor: "inherit",
    fontSize: "1.4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    gap: ".5rem",
    transition: "all .1s",
    "&:hover": {
      color: "#00ADB5",
      transform: "translateY(-.1rem) scale(1.01)",
    },
  },
  adText: { color: "#777777", marginLeft: ".5rem" },
});
