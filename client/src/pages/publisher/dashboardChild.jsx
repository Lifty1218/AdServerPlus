import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { MdOutlinePublishedWithChanges, MdPayments } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import { AiFillDollarCircle } from "react-icons/ai";
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
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const classes = useStyles();
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));

  const [payments, setPayments] = useState([]);
  const [domains, setDomains] = useState(0);
  const [adSpaces, setAdSpaces] = useState(0);
  const [adRequests, setAdRequests] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [domainData, setDomainData] = useState([]);
  const [adSpaceData, setAdSpaceData] = useState([]);
  const COLORS = ["#00ADB5", "#8d7cef", "#F08A5D"];

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

  useEffect(() => {
    fetchPayments();
    fetchData();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/payment/publisher/${currentPublisher._id}`
      );
      setPayments(response.data);
      console.log(response.data);
      let totalAmount = 0;

      response.data.forEach((payment) => {
        totalAmount += parseFloat(payment.amount.split(" ")[0]);
      });
      setTotalEarnings(totalAmount);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/publisher/statistics/${currentPublisher._id}`
      );
      setDomains(response.data.domainCount);
      setAdSpaces(response.data.adSpaceCount);
      setAdRequests(response.data.requestedAdCount);
      if (response.data.adSpaceCount > 0) {
        setAdSpaceData([
          { name: "Total AdSpaces", count: response.data.adSpaceCount },
          {
            name: "Filled AdSpaces",
            count: response.data.filledAdSpaces,
          },
          { name: "Empty AdSpaces", count: response.data.emptyAdSpaces },
        ]);
      }
      if (response.data.domainCount > 0) {
        setDomainData([
          { name: "Domains", value: response.data.domainCount },
          { name: "AdSpaces", value: response.data.adSpaceCount },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.dashboardMain}>
      <div className={classes.dashboardUpper}>
        <UpperBox icon={<CgWebsite />} title="Total Domains" total={domains} />
        <UpperBox
          icon={<RiAdvertisementFill />}
          title="Total Ad Spaces"
          total={adSpaces}
          iconBgColor="#00ADB5"
          totalColor="#00ADB5"
        />
        <UpperBox
          icon={<MdOutlinePublishedWithChanges />}
          title="Pending Ad Requests"
          total={adRequests}
          iconBgColor="#8d7cef"
          totalColor="#8d7cef"
        />
        <UpperBox
          icon={<AiFillDollarCircle />}
          title="Total Earnings"
          total={totalEarnings}
          iconBgColor="#F08A5D"
          totalColor="#F08A5D"
        />
      </div>
      <div className={classes.dashboardMid}>
        <div className={classes.barChart}>
          <ResponsiveContainer>
            <BarChart
              data={adSpaceData}
              margin={{ top: 20, right: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#00ADB5" />
              {/* <Bar dataKey="value" fill="#F08A5D" /> */}
            </BarChart>
          </ResponsiveContainer>
          {adSpaceData.length < 1 && (
            <p
              style={{
                position: "absolute",
                top: "48%",
                left: "50%",
                fontSize: "3rem",
                transform: "translate(-50%, -50%)",
                color: "#777777",
                textAlign: "center",
              }}
            >
              Not Enough Data
            </p>
          )}
        </div>
        <div className={classes.pieChart}>
          <ResponsiveContainer>
            <PieChart
            // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Pie
                data={domainData}
                // cx={175}
                // cy={175}
                innerRadius={80}
                // outerRadius={110}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {domainData.map((entry, index) => (
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
          {domainData.length < 1 && (
            <p
              style={{
                position: "absolute",
                top: "48%",
                left: "50%",
                fontSize: "3rem",
                transform: "translate(-50%, -50%)",
                color: "#777777",
                textAlign: "center",
              }}
            >
              Not Enough Data
            </p>
          )}
        </div>
      </div>
      <div className={classes.dashboardLower}>
        <h3 className={classes.dashboardLowerHeading}>
          <span style={{ marginRight: "1.5rem", marginTop: ".3rem" }}>
            <MdPayments />
          </span>
          Earnings
        </h3>
        {payments && payments.length != 0 ? (
          <div className={classes.paymentOuterContainer}>
            <div
              className={classes.paymentContainer}
              style={{ marginBottom: ".8rem" }}
            >
              <p
                className={classes.paymentItem}
                style={{ fontWeight: "bold", fontSize: "1.8rem" }}
              >
                Item
              </p>
              <p
                className={classes.paymentItem}
                style={{
                  fontWeight: "bold",
                  flexBasis: "15%",
                  fontSize: "1.8rem",
                }}
              >
                Earning
              </p>
              <p
                className={classes.paymentItem}
                style={{
                  fontWeight: "bold",
                  flexBasis: "30%",
                  fontSize: "1.8rem",
                }}
              >
                Ad Space Id
              </p>
              <p
                className={classes.paymentItem}
                style={{ fontWeight: "bold", fontSize: "1.8rem" }}
              >
                Date
              </p>
              <p
                className={classes.paymentItem}
                style={{ fontWeight: "bold", fontSize: "1.8rem" }}
              >
                Time
              </p>
            </div>
            {payments.map((payment, index) => {
              const dateObject = new Date(payment.timestamp);
              const time = dateObject.toLocaleTimeString();
              const date = dateObject.toLocaleDateString();
              return (
                <div key={index} className={classes.paymentContainer}>
                  <p className={classes.paymentItem}>{payment.product}</p>
                  <p
                    className={classes.paymentItem}
                    style={{ flexBasis: "15%" }}
                  >
                    {payment.amount}
                  </p>
                  <p
                    className={classes.paymentItem}
                    style={{ flexBasis: "30%" }}
                  >
                    {payment.adSpace}
                  </p>
                  <p className={classes.paymentItem}>{date}</p>
                  <p className={classes.paymentItem}>{time}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={classes.emptyHeading}>No Payments to Show</p>
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
  dashboardMid: {
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
    position: "relative",
  },
  pieChart: {
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
    borderRadius: ".8rem",
    padding: "2rem 0",
    width: "calc(50% - 2rem)",
    height: 400,
    position: "relative",
  },
  dashboardLower: {
    marginTop: "6rem",
    padding: "2.5rem 5rem 4rem",
    borderRadius: ".8rem",
    backgroundColor: "#fff",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.2)",
  },
  dashboardLowerHeading: {
    display: "flex",
    alignItems: "center",
    fontSize: "2.5rem",
    marginBottom: "3.5rem",
  },
  paymentOuterContainer: {
    display: "flex",
    flexDirection: "column",
  },
  paymentContainer: {
    display: "flex",
    gap: "1rem",
  },
  paymentItem: {
    flexBasis: "20%",
    fontSize: "1.6rem",
    marginBottom: ".2rem",
  },
  emptyHeading: {
    fontSize: "2.4rem",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
});
