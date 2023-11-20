import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate, useLocation } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
import Heading from "../../common/components/headingIcon";
import axios from "axios";
import LoadingSpinner from "../../common/components/loadingSpinner";
import { pricePlans } from "../../data/localData";

export default function AdsNewPricePlans() {
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const [activePlan, setActivePlan] = useState("cpc");
  const [isLoading, setIsLoading] = useState(false);
  const [adId, setAdId] = useState("");
  const currentAdvertiser = JSON.parse(localStorage.getItem("advertiser"));

  const PriceContainer = ({ plan, color, type, planArray }) => {
    return (
      <button
        onClick={() =>
          handleClick(
            plan.toLowerCase(),
            type,
            planArray.price,
            planArray.description
          )
        }
        className={classes.innerContainer}
      >
        <div
          className={classes.upperContainer}
          style={{ backgroundColor: color }}
        >
          <span className={classes.pricePlanText}>{plan}</span>
        </div>
        <div className={classes.innerTextContainer}>
          {planArray.features.map((feature, index) => (
            <p className={classes.innerText} key={index}>
              {feature}
            </p>
          ))}
        </div>
        <div
          className={classes.bottomContainer}
          style={{
            backgroundColor: color,
          }}
        >
          <span className={classes.priceText}>$ {planArray.price}</span>
        </div>
      </button>
    );
  };

  console.log(pricePlans.cpc.basic.description);

  useEffect(() => {
    if (!location.state) {
      navigate("/advertiser/ads_new/main");
    } else {
      setAdId(location.state.adId);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = async (priceTier, priceType, price, description) => {
    try {
      const pricePlan = {
        type: priceType,
        tier: priceTier,
        price: price,
        success: false,
      };
      console.log(pricePlan);
      // UPDATE THE AD COLLECTION
      await axios.patch(`http://localhost:5000/ad/${adId}`, {
        pricePlan: pricePlan,
      });

      // REDIRECT CHECKOUT
      const response = await axios.post(
        `http://localhost:5000/payment/checkout`,
        {
          product: {
            name:
              priceType.toUpperCase() +
              " " +
              priceTier.charAt(0).toUpperCase() +
              priceTier.slice(1) +
              " Plan",
            description: description,
          },
          price: price,
          adId: adId,
          stripeId: currentAdvertiser.stripeId,
        }
      );

      window.location.href = response.data.url;
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Finding the best price plans for you..." />;
  }

  return (
    <div className={classes.main}>
      <div>
        <Heading
          text="Price Plans"
          icon={<FaDollarSign />}
          headingStyle={{
            fontSize: "2.6rem",
            marginBottom: "2rem",
            marginTop: "2rem",
          }}
        />
        <h3 className={classes.heading}>
          Choose the best plan for your business.
        </h3>
        <div className={classes.planChangeContainer}>
          <button
            onClick={() => setActivePlan("cpc")}
            className={`${classes.planChangeButton} ${classes.changeButton1} ${
              activePlan == "cpc" ? classes.active : ""
            }`}
          >
            CPC
          </button>
          <button
            onClick={() => setActivePlan("cpm")}
            className={`${classes.planChangeButton} ${classes.changeButton2} ${
              activePlan == "cpm" ? classes.active : ""
            }`}
          >
            CPM
          </button>
        </div>
        {activePlan == "cpc" && (
          <div className={classes.container}>
            <PriceContainer
              color="#00ADB5"
              type="cpc"
              plan="Basic"
              planArray={pricePlans.cpc.basic}
            />

            <PriceContainer
              color="#F08A5D"
              type="cpc"
              plan="Standard"
              planArray={pricePlans.cpc.standard}
            />

            <PriceContainer
              color="#8D7CEF"
              type="cpc"
              plan="Premium"
              planArray={pricePlans.cpc.premium}
            />
          </div>
        )}

        {activePlan == "cpm" && (
          <div className={classes.container}>
            <PriceContainer
              color="#00ADB5"
              type="cpm"
              plan="Basic"
              planArray={pricePlans.cpm.basic}
            />

            <PriceContainer
              color="#F08A5D"
              type="cpm"
              plan="Standard"
              planArray={pricePlans.cpm.standard}
            />

            <PriceContainer
              color="#8D7CEF"
              type="cpm"
              plan="Premium"
              planArray={pricePlans.cpm.premium}
            />
          </div>
        )}
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
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  innerContainer: {
    flex: "1 0 28rem",
    maxWidth: "36rem",
    backgroundColor: "#fff",
    boxShadow: "0 1rem 2.5rem rgba(0,0,0,0.3)",
    borderRadius: "1rem",
    transition: "all .3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-.5rem) scale(1.05) ",
      boxShadow: "0 1.5rem 3rem rgba(0,0,0,0.4)",
    },
  },
  upperContainer: {
    width: "100%",
    color: "#eee",
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    padding: "3rem 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pricePlanText: {
    fontSize: "3.5rem",
    // margin: "0 8rem 1rem 0",
  },
  innerTextContainer: {
    flex: "1",
    // margin: "2rem 2.5rem 0",
    padding: "3rem 6rem 0",
    width: "100%",
  },
  innerText: {
    fontSize: "1.6rem",
    marginBottom: "1.8rem",
    color: "#6d6d6d",
    lineHeight: "3rem",
    paddingBottom: "1.5rem",
    "&:not(:last-child)": {
      borderBottom: "1px solid #dbdbdb",
    },
  },
  bottomContainer: {
    width: "100%",
    color: "#eee",
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    padding: "3rem 0",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: "3rem",
    fontWeight: "lighter",
    // margin: "1rem 0 0 10rem",
  },
  planChangeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "3rem 0",
  },
  planChangeButton: {
    padding: "2.5rem",
    backgroundColor: "#374151",
    color: "#fff",
    margin: ".2rem",
    fontSize: "1.8rem",
    "&:hover": {
      backgroundColor: "#07bbc1",
    },
  },
  changeButton1: {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  },
  changeButton2: {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  },
  active: {
    backgroundColor: "#00ADB5",
    transform: "scale(1.05)",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.3)",
  },
});
