import React, { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../../common/components/headingIcon";
import { createUseStyles } from "react-jss";
import { Form } from "react-router-dom";
import { FaPlusCircle, FaCopy } from "react-icons/fa";
import { capitalize } from "lodash";
import { TiTickOutline } from "react-icons/ti";

import {
  bannerImgSizeArray,
  sideImgSizeArray,
  innerImgSizeArray,
  adSpaceTypeArray,
} from "../../data/localData";

export default function AdSpacesNew() {
  const [scriptTag, setScriptTag] = useState("");
  const [adContainer, setAdContainer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const classes = useStyles();
  // const navigate = useNavigate();

  const [domainURL, setDomainURL] = useState("");
  const [domainData, setDomainData] = useState([]);
  const [adSpaceSize, setAdSpaceSize] = useState("");
  const [adSpaceSizeField, setAdSpaceSizeField] = useState("");
  const [adSpaceType, setAdSpaceType] = useState("banner");
  const [errTxt, setErrTxt] = useState("");
  const [adSpaceSizeArray, setAdSpaceSizeArray] = useState(null);
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));
  const [domains, setDomains] = useState(null);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(scriptTag);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleCopyClick2 = () => {
    navigator.clipboard.writeText(adContainer);
    setIsCopied2(true);
    setTimeout(() => setIsCopied2(false), 3000);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (adSpaceType == "banner") {
      setAdSpaceSizeArray([...bannerImgSizeArray]);
      setAdSpaceSizeField(bannerImgSizeArray[0]);
      setAdSpaceSize(bannerImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    } else if (adSpaceType == "inner") {
      setAdSpaceSizeArray([...innerImgSizeArray]);
      setAdSpaceSizeField(innerImgSizeArray[0]);
      setAdSpaceSize(innerImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    } else if (adSpaceType == "side") {
      setAdSpaceSizeArray([...sideImgSizeArray]);
      setAdSpaceSizeField(sideImgSizeArray[0]);
      setAdSpaceSize(sideImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    }
  }, [adSpaceType]);

  const fetchDomains = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/publisher/domain/${currentPublisher._id}`
      );
      setDomainData(response.data);
      const domainsArray = response.data.map((domain) => domain.url);
      setDomains(domainsArray);
      setDomainURL(domainsArray[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (domainURL && adSpaceType && adSpaceSize) {
      setErrTxt("");
      let domainId = "";
      domainData.forEach((element) => {
        if (element.url == domainURL) {
          domainId = element._id;
        }
      });
      try {
        const response = await axios.post(
          `http://localhost:5000/publisher/ad_space/${domainId}`,
          {
            publisher: currentPublisher._id,
            domain: domainId,
            adSize: adSpaceSize,
            adType: adSpaceType,
          }
        );
        setIsSubmitted(true);
        setScriptTag(response.data.scriptTag);
        setAdContainer(response.data.adContainer);
      } catch (err) {
        console.log(err);
      }
    } else {
      setErrTxt("Please Select All the fields");
    }
  };

  if (domains) {
    return (
      <>
        {!isSubmitted ? (
          <div className={classes.app}>
            <Heading
              text="Add a new ad space"
              icon={<FaPlusCircle />}
              headingStyle={{ marginBottom: "4rem" }}
            />
            <h3 className={classes.heading}>Select the following fields:</h3>
            <Form
              onSubmit={handleFormSubmit}
              method="POST"
              className={classes.form}
            >
              <div className={classes.nestedContainer}>
                <div className={classes.nestedContainerItem}>
                  <label htmlFor="domainURL" className={classes.label}>
                    Domain Name
                  </label>
                  <select
                    id="domainURL"
                    name="domainURL"
                    required
                    value={domainURL}
                    onChange={(e) => {
                      setDomainURL(e.target.value);
                    }}
                    className={`${classes.input}`}
                  >
                    {domains.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={classes.nestedContainer}>
                <div className={classes.nestedContainerItem}>
                  <label htmlFor="adSpaceType" className={classes.label}>
                    Ad Space Type
                  </label>
                  <select
                    id="adSpaceType"
                    name="adSpaceType"
                    required
                    value={adSpaceType}
                    onChange={(e) => {
                      setAdSpaceType(e.target.value);
                    }}
                    className={`${classes.input}`}
                  >
                    {adSpaceTypeArray.map((type, index) => (
                      <option key={index} value={type}>
                        {capitalize(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={classes.nestedContainerItem}>
                  <label htmlFor="adSpaceSize" className={classes.label}>
                    Ad Space Size (px)
                  </label>
                  <select
                    id="adSpaceSize"
                    name="adSpaceSize"
                    required
                    value={adSpaceSizeField}
                    onChange={(e) => {
                      setAdSpaceSizeField(e.target.value);
                      setAdSpaceSize(
                        e.target.value.split("(")[1].slice(0, -4).trim()
                      );
                    }}
                    className={`${classes.input}`}
                  >
                    {adSpaceSizeArray &&
                      adSpaceSizeArray.map((category, index) => (
                        <option key={index} value={category}>
                          {capitalize(category)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {errTxt && (
                <span
                  style={{
                    color: "orangered",
                    margin: "0 0 1.5rem 1rem",
                    fontSize: "1.4rem",
                  }}
                >
                  {errTxt}
                </span>
              )}

              <p style={{ margin: "1.4rem 1rem 2rem", color: "#6b6a6a" }}>
                * CPM (Cost Per Mile/Thousand) and CPC (Cost Per Click) for this
                ad space will be calculated automatically depending on your
                website's analytic scores and other metrics
              </p>
              <button className={classes.button}>Create ad space</button>
            </Form>
          </div>
        ) : (
          <div className={classes.afterSubmissionContainer}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
              }}
            >
              Ad_Space Succesfully Added
              <span style={{ fontSize: "4rem", marginLeft: "1rem" }}>
                <TiTickOutline />
              </span>
            </div>
            <p className={classes.someText3}>
              Please copy the following div tag to the location which you want
              to designate as an AdSpace in the html of your website
            </p>
            <div className={classes.scriptContainer}>
              <p className={classes.script}>{adContainer && adContainer}</p>
              <button onClick={handleCopyClick2} className={classes.scriptBtn}>
                <FaCopy />
                {isCopied2 ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className={classes.someText3} style={{ marginTop: "6rem" }}>
              Please copy the following script code at the end of the body tag
              in the html of your website
            </p>
            <div className={classes.scriptContainer}>
              <p className={classes.script}>{scriptTag && scriptTag}</p>
              <button onClick={handleCopyClick} className={classes.scriptBtn}>
                <FaCopy />
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div
              style={{
                marginTop: "3rem",
                textAlign: "left",
                padding: "0 4rem",
              }}
            >
              <p
                style={{
                  color: "#00ADB5",
                  fontWeight: "bold",
                  marginBottom: ".5rem",
                  fontSize: "1.8rem",
                }}
              >
                * Make sure you paste the script tag in the end of your HTML
                file, just before the body tag ends.
              </p>
              <p
                style={{
                  color: "#00ADB5",
                  fontWeight: "bold",
                  fontSize: "1.8rem",
                }}
              >
                * Make sure you have designated an AdSpace in your website by
                copying the the above given div tag in your website HTML.
              </p>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className={classes.someText}>
        You don't have any domains to register ad spaces for
        <p className={classes.someText2}>Register a Domain first</p>
      </div>
    );
  }
}

const useStyles = createUseStyles({
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "1.8rem",
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  headingTertiary: {
    fontSize: "1.4rem",
    marginBottom: "1rem",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    marginTop: "2rem",
  },
  form: {
    padding: "10px",
    width: "80%",
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
  },
  label: {
    fontSize: "1.15rem",
    marginBottom: ".5rem",
    marginLeft: ".2rem",
    display: "inline-block",
  },
  input: {
    marginBottom: ".5rem",
    padding: "1.2rem 1.8rem",
    borderRadius: "3px",
    outline: "none",
    border: "1px solid #ddd",
    width: "100%",
  },
  nestedContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: "4rem",
  },
  nestedContainerItem: {
    flex: "1",
    marginBottom: "2rem",
  },
  button: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    backgroundColor: "#00ADB5",
    border: "none",
    color: "#f5f5f5",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "3px",
    textTransform: "uppercase",
    marginTop: "1rem",
    transition: "all .2s",
    "&:hover": {
      backgroundColor: "#374151",
    },
  },
  someText: {
    fontSize: "3.5rem",
    textAlign: "center",
    margin: "30vh 10rem",
    textTransform: "uppercase",
  },
  someText2: {
    fontSize: "2.5rem",
    margin: "2rem",
    textTransform: "uppercase",
    color: "#777777",
  },
  someText3: {
    fontSize: "2rem",
    margin: "4rem 0 2rem",
    textTransform: "uppercase",
    color: "#777777",
    fontWeight: "bold",
  },
  suggestion: {
    fontSize: "1.2rem",
    color: "#00ADB5",
  },
  afterSubmissionContainer: {
    alignItems: "center",
    fontSize: "3.2rem",
    textAlign: "center",
    margin: "6rem 5%",
  },
  scriptContainer: {
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "2.5rem 2rem 2.5rem 4rem",
    borderRadius: "1rem",
    boxShadow: "0 .5rem 1rem rgba(0,0,0,0.2)",
    gap: "2rem",
    overflow: "auto",
  },
  script: {
    flex: "1",
    color: "#777777",
  },
  scriptBtn: {
    backgroundColor: "inherit",
    fontSize: "1.8rem",
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
});
