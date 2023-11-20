import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useLocation, useNavigate } from "react-router-dom";
import UserCountChart from "../../common/components/Analytics/userCountChart";
import UserPerHourChart from "../../common/components/Analytics/userPerHourChart";
import BrowserChart from "../../common/components/Analytics/BrowserChart";
import DeviceChart from "../../common/components/Analytics/deviceChart";
import Heading from "../../common/components/headingIcon";
import MapChart from "../../common/components/Analytics/mapChart";
import { IoMdAnalytics } from "react-icons/io";

export default function Analytics() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (!location.state) {
      navigate("/publisher/domains");
    } else {
      setDomain(location.state.domain);
    }
  }, []);

  return (
    <div>
      <Heading
        text="Website Analytics"
        icon={<IoMdAnalytics />}
        headingStyle={{ marginBottom: "2rem" }}
      />
      {domain && (
        <Heading
          text={domain.name}
          headingStyle={{ marginBottom: ".5rem", fontSize: "2.8rem" }}
        />
      )}
      {domain && (
        <Heading
          text={domain.url}
          headingStyle={{
            marginBottom: "4rem",
            fontSize: "2rem",
            color: "#777777",
            textTransform: "none",
          }}
        />
      )}
      <div className={classes.container}>
        {domain && (
          <div
            className={classes.chartContainer}
            style={{ width: "calc(65% - 2rem)" }}
          >
            <UserCountChart domainId={domain.id} />
          </div>
        )}
        {domain && (
          <div
            className={classes.chartContainer}
            style={{ width: "calc(35% - 2rem)" }}
          >
            <BrowserChart domainId={domain.id} />
          </div>
        )}
        {domain && (
          <div
            className={classes.chartContainer}
            style={{ width: "calc(65% - 2rem)" }}
          >
            <UserPerHourChart domainId={domain.id} />
          </div>
        )}
        {domain && (
          <div
            className={classes.chartContainer}
            style={{ width: "calc(35% - 2rem)" }}
          >
            <DeviceChart domainId={domain.id} />
          </div>
        )}

        {domain && (
          <div
            className={classes.chartContainer}
            style={{ width: "100%", height: "auto" }}
          >
            <MapChart domainId={domain.id} />
          </div>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4rem",
  },
  chartContainer: {
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
    borderRadius: ".8rem",
    padding: "1.5rem",
    // width: "calc(50% - 2rem)",
    // width: "100%",
    height: 450,
    position: "relative",
  },
});
