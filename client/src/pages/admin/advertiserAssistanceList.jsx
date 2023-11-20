import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import Heading from "../../common/components/headingIcon";
import { FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdvertiserList = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/advertiser/initialized")
      .then((response) => setAdvertisers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleClick = (id, name, imageURL) => {
    console.log("Advertiser Id: ", id);
    navigate("chat", {
      state: { advertiser: { id: id, name: name, imageURL: imageURL } },
    });
  };

  return (
    <div className={classes.container}>
      <Heading
        text="Advertiser Assistance"
        icon={<FiHelpCircle />}
        headingStyle={{ marginBottom: "4rem" }}
      />
      <ul className={classes.list}>
        {advertisers.map((advertiser) => (
          <li
            key={advertiser._id}
            className={classes.item}
            onClick={() =>
              handleClick(advertiser._id, advertiser.name, advertiser.imageURL)
            }
          >
            <img
              src={advertiser.imageURL}
              alt={advertiser.name}
              className={classes.image}
            />
            <div className={classes.content}>
              <h3 className={classes.name}>{advertiser.name}</h3>
              <p
                style={{
                  color: "#515151",
                  fontSize: "1.3rem",
                  marginBottom: ".6rem",
                }}
              >
                {advertiser.email}
              </p>
              <p className={classes.message}>
                <span
                  style={{
                    color: "#515151",
                    marginRight: ".5rem",
                  }}
                >
                  {advertiser.message.sender.charAt(0).toUpperCase() +
                    advertiser.message.sender.slice(1)}
                  :
                </span>
                {advertiser.message.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    padding: "2.5rem 5%",
    fontFamily: "Arial, sans-serif",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    alignItems: "center",
    margin: "0 5% 2rem",
    padding: "2.5rem 3.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    gap: "2rem",
    cursor: "pointer",
    boxShadow: "0 .4rem .8rem rgba(0,0,0,0.2)",
    transition: "all .2s",
    borderBottom: ".5rem solid #00ADB5",
    "&:hover": {
      transform: "translateY(-.5rem) scale(1.05) ",
      boxShadow: "0 .8rem 1.2rem rgba(0,0,0,0.3)",
    },
  },
  image: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  message: {
    fontSize: "1.5rem",
  },
});

export default AdvertiserList;
