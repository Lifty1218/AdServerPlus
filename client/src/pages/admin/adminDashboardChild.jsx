import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { FaUserTie, FaUserEdit } from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const classes = useStyles();
  const [advertisers, setAdvertisers] = useState();
  const [publishers, setPublishers] = useState();
  const [ads, setAds] = useState();
  const [adSpaces, setAdSpaces] = useState();
  const [UserData, setUserData] = useState();
  const [TotalUserData, setTotalUserData] = useState();

  const COLORS = ["#00ADB5", "#8d7cef", "#F08A5D"];

  useEffect(() => {
    fetchTotalAdvertisers();
  }, []);

  useEffect(() => {
    setUserData([
      { name: "AdSpaces", value: adSpaces },
      { name: "Ads", value: ads },
    ]);
    setTotalUserData([
      { name: "Total Users", Total: advertisers + publishers },
      { name: "Advertisers", Total: advertisers },
      { name: "Publishers", Total: publishers },
    ]);
  }, [adSpaces]);

  const fetchTotalAdvertisers = async () => {
    const response = await axios.get("http://localhost:5000/advertiser/");
    setAdvertisers(response.data.length);
    fetchTotalPublishers();
  };
  const fetchTotalPublishers = async () => {
    const response = await axios.get("http://localhost:5000/publisher/");
    setPublishers(response.data.length);
    fetchTotalAds();
  };

  const fetchTotalAds = async () => {
    const response = await axios.get("http://localhost:5000/ad/");
    setAds(response.data.length);
    fetchTotalAdSpaces();
  };
  const fetchTotalAdSpaces = async () => {
    const response = await axios.get("http://localhost:5000/ad_space/");
    setAdSpaces(response.data.length);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#374151",
            padding: ".8rem",
            borderRadius: ".5rem",
          }}
        >
          <p
            className="label"
            style={{ color: "#fff" }}
          >{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const UpperBox = ({ icon, iconBgColor, title, total, totalColor }) => {
    return (
      <div className={classes.upperBox}>
        <span
          style={{ backgroundColor: iconBgColor }}
          className={[classes.upperBoxIcon]}
        >
          {icon}
        </span>
        <h3 className={classes.upperBoxTitle}>{title}</h3>
        <span style={{ color: totalColor }} className={classes.upperBoxNumber}>
          {total}
        </span>
      </div>
    );
  };

  return (
    <div className={classes.dashboardMain}>
      <div className={classes.dashboardUpper}>
        <UpperBox
          icon={<RiAdvertisementFill />}
          title="Total Ads"
          total={ads}
        />
        <UpperBox
          icon={<FaUserTie />}
          title="Total Advertisers"
          total={advertisers}
          iconBgColor="#00ADB5"
          totalColor="#00ADB5"
        />
        <UpperBox
          icon={<FaUserEdit />}
          title="Total Publishers"
          total={publishers}
          iconBgColor="#8d7cef"
          totalColor="#8d7cef"
        />
        <UpperBox
          icon={<CgWebsite />}
          title="Total AdSpaces"
          total={adSpaces}
          iconBgColor="#F08A5D"
          totalColor="#F08A5D"
        />
      </div>
      <div className={classes.dashboardLower}>
        {TotalUserData && (
          <div className={classes.barChart}>
            <ResponsiveContainer>
              <BarChart
                data={TotalUserData}
                margin={{ top: 20, right: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {/* <Bar dataKey="value" fill="#8884d8" /> */}
                <Bar dataKey="Total" fill="#F08A5D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {UserData && (
          <div className={classes.pieChart}>
            <ResponsiveContainer>
              <PieChart
              // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Pie
                  data={UserData}
                  innerRadius={80}
                  // outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {UserData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  dashboardUpper: {
    display: "flex",
    gap: "4rem",
    marginTop: "4.4rem",
    flexWrap: "wrap",
  },
  upperBox: {
    position: "relative",
    flex: "1 0 20rem",
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
    borderRadius: ".8rem",
    padding: "3rem 1.5rem 2rem",
    textAlign: "center",
  },
  upperBoxIcon: {
    position: "absolute",
    top: "-3rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#374151",
    padding: "0 1rem",
    fontSize: "4.2rem",
    color: "#fff",
    borderRadius: "1rem",
  },
  upperBoxTitle: {
    fontSize: "1.8rem",
    color: "#374151",
    marginTop: "2.4rem",
    marginBottom: ".5rem",
  },
  upperBoxNumber: {
    fontSize: "3.9rem",
  },
  dashboardLower: {
    display: "flex",
    alignItems: "center",
    marginTop: "6rem",
    justifyContent: "center",
    gap: "4rem",
    flexWrap: "wrap",
  },
  barChart: {
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
    borderRadius: ".8rem",
    padding: "2.75rem 2.5rem 1rem 1rem",
    width: "calc(50% - 2rem)",
    height: 400,
  },
  pieChart: {
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
    borderRadius: ".8rem",
    padding: "2rem 0",
    width: "calc(50% - 2rem)",
    height: 400,
  },
});
