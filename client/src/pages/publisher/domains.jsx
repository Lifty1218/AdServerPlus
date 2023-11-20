import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { AiOutlineClose } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { IoCreateSharp } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import Button from "../../common/components/button";
import { Form } from "react-router-dom";
import Heading from "../../common/components/headingIcon";
import { categoriesArray } from "../../data/localData";
import { FaCopy } from "react-icons/fa";
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function Domains() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [domain, setDomain] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    categoriesArray[0] || "Arts & Entertainment"
  );
  const [webAnalyticsScript, setWebAnalyticsScript] = useState("");
  const [domains, setDomains] = useState(null);
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));
  const [isCopied, setIsCopied] = useState(false);
  const [clipboardText, setClipboardText] = useState("");

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setClipboardText(text);
  };

  const handleCopyClick2 = () => {
    navigator.clipboard.writeText(webAnalyticsScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (domain && category && name) {
      try {
        const response = await axios.post(
          `http://localhost:5000/publisher/domain/${currentPublisher._id}`,
          {
            name: name,
            url: domain,
            category: category,
          }
        );
        setDomains(response.data.publisher.domains);
        setWebAnalyticsScript(response.data.webAnalyticsScript);
        setIsModalOpen(false);
        setIsModal2Open(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please fill all the fields");
    }
  };

  useEffect(() => {
    fetchPublisher();
  }, []);

  const fetchPublisher = async () => {
    const response = await axios.get(
      `http://localhost:5000/publisher/domain/${currentPublisher._id}`
    );
    if (response.data && response.data.length > 0) {
      setDomains(response.data);
    }
  };

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleModal2OverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModal2Open(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModal2Close = () => {
    setIsModal2Open(false);
  };

  return (
    <div className={classes.main}>
      <Heading
        text="Your Domains"
        icon={<CgWebsite />}
        headingStyle={{ marginBottom: "4rem" }}
      />
      <Button
        text="Add Domain"
        func={handleButtonClick}
        afterIcon={<IoCreateSharp />}
      />
      <div style={{ marginTop: "4rem" }}>
        {domains ? (
          domains.map((element, index) => (
            <div key={index} className={classes.domainContainer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {element.name}
                </h3>
                <button
                  className={classes.analyticsButton}
                  onClick={() => {
                    navigate("analytics", {
                      state: {
                        domain: {
                          id: element._id,
                          url: element.url,
                          name: element.name,
                        },
                      },
                    });
                  }}
                >
                  <span className={classes.analyticsIcon}>
                    <IoMdAnalytics />
                  </span>
                </button>
              </div>
              <h4 className={classes.smallHeading}>
                Domain URL:{" "}
                <span style={{ color: "#777777" }}>{element.url}</span>
              </h4>
              <h4 className={classes.smallHeading}>
                Category:{" "}
                <span style={{ color: "#777777" }}>{element.category}</span>
              </h4>
              <h4 className={classes.smallHeading}>Web Analytics Script:</h4>
              <div className={classes.scriptContainer}>
                <h4 className={classes.script}>{element.webAnalyticsScript}</h4>
                <button
                  onClick={() => handleCopyClick(element.webAnalyticsScript)}
                  className={classes.scriptBtn}
                >
                  <FaCopy />
                  {clipboardText == element.webAnalyticsScript
                    ? "Copied!"
                    : "Copy"}
                </button>
              </div>
              {element.adSpaces.length > 0 ? (
                <span className={classes.adSpaceSpan}>
                  Total AD Spaces:
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      marginLeft: ".4rem",
                    }}
                  >
                    {element.adSpaces.length}
                  </span>
                </span>
              ) : (
                <span className={classes.adSpaceSpan}>
                  No ad spaces registered in this domain
                </span>
              )}
            </div>
          ))
        ) : (
          <span style={{ fontSize: "2.5rem", margin: "25vh 0 40vh" }}>
            You currently have no domains registered.
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
        <button
          style={{ fontSize: "1.8rem", backgroundColor: "inherit" }}
          onClick={handleModalClose}
        >
          <AiOutlineClose />
        </button>
        <div className={classes.innerModal}>
          <h2
            style={{
              fontSize: "2rem",
              textTransform: "uppercase",
              marginBottom: "2.2rem",
            }}
          >
            Enter domain Information
          </h2>
          <Form onSubmit={handleSubmit} className={classes.innerForm}>
            <label htmlFor="name" className={classes.label}>
              Website Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={classes.input}
              placeholder="Website Title"
            />

            <label htmlFor="domain" className={classes.label}>
              Domain URL:
            </label>
            <input
              type="url"
              id="domain"
              name="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={classes.input}
              placeholder="http://www.example.com"
            />

            <label htmlFor="category" className={classes.label}>
              Website Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className={classes.input}
            >
              {categoriesArray.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                padding: "1.2rem 3.6rem",
                backgroundColor: "#00ADB5",
                color: "#eee",
                fontSize: "1.6rem",
                borderRadius: ".3rem",
              }}
            >
              Submit
            </button>
          </Form>
        </div>
      </Modal>

      <Modal
        isOpen={isModal2Open}
        onRequestClose={handleModal2OverlayClick}
        shouldCloseOnOverlayClick={true}
        className={classes.content}
        overlayClassName={classes.overlay}
      >
        <button
          style={{ fontSize: "1.8rem", backgroundColor: "inherit" }}
          onClick={handleModal2Close}
        >
          <AiOutlineClose />
        </button>
        <div className={classes.innerModal}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              fontSize: "3.2rem",
            }}
          >
            Domain Succesfully Added
            <span style={{ fontSize: "3.5rem", marginLeft: "1rem" }}>
              <TiTickOutline />
            </span>
          </h3>
          <p
            style={{
              fontSize: "2rem",
              margin: "3rem",
              textTransform: "uppercase",
              color: "#777777",
              fontWeight: "bold",
            }}
          >
            For Web Analytics, please copy the following script code at the end
            of the body tag in the html of your website
          </p>
          <div className={classes.scriptContainer}>
            <p className={classes.script}>
              {webAnalyticsScript && webAnalyticsScript}
            </p>
            <button onClick={handleCopyClick2} className={classes.scriptBtn}>
              <FaCopy />
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const useStyles = createUseStyles({
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    padding: "2rem 3rem 4rem",
    background: "#FFFFFF",
    boxShadow: "0px .4rem .8rem rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(rgba(34, 40, 49, 0.3),rgba(57, 62, 70, 0.3))",
    zIndex: "9999",
  },
  innerModal: {
    textAlign: "center",
    width: "100%",
  },
  innerForm: {
    display: "flex",
    flexDirection: "column",
    padding: "0  2rem",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  domainContainer: {
    margin: "2rem 6rem 4rem",
    padding: "3rem 4rem",
    backgroundColor: "#fff",
    textAlign: "left",
    borderRadius: ".5rem",
    boxShadow: "0 .4rem .8rem rgba(0,0,0,0.2)",
  },
  adSpaceSpan: {
    fontSize: "1.4rem",
    color: "#a3a3a3",
  },
  input: {
    backgroundColor: "#eee",
    border: "none",
    padding: "1.2rem 2rem",
    margin: ".5rem 0 2.5rem",
    outline: "none",
    width: "40rem",
  },
  label: {
    fontSize: "1.4rem",
    alignSelf: "flex-start",
    margin: "0 .3rem",
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
    fontSize: "1.5rem",
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
  smallHeading: {
    fontSize: "1.5rem",
    marginBottom: ".8rem",
  },
  analyticsButton: {
    backgroundColor: "transparent",
    color: "#777",
    transition: "all .2s ease-in-out",
    "&:hover": {
      color: "#00ADB5",
      transform: "translateY(-.4rem) scale(1.01)",
    },
  },
  analyticsIcon: {
    fontSize: "3rem",
  },
});
