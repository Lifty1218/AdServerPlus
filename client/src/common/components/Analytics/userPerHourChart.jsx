import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserCountChart = ({ domainId }) => {
  const [userCounts, setUserCounts] = useState([]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/web_analytics/average_traffic_by_hour/${domainId}`
        );
        if (response.data.length > 0) {
          const array = [];
          for (let index = 1; index < 25; index++) {
            let value = 0;
            response.data.forEach((element) => {
              if (element.hour === index) {
                value = element.averageTraffic;
              }
            });
            array.push({
              name: index,
              userCount: parseFloat(value.toFixed(2)),
            });
          }
          setUserCounts(array);
        }
      } catch (error) {
        console.error("Error retrieving user counts:", error);
      }
    };

    fetchUserCounts();
  }, [domainId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#374151",
            padding: "1.2rem",
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

  return (
    <>
      <p
        style={{
          position: "absolute",
          top: "3%",
          left: "50%",
          fontSize: "2.5rem",
          transform: "translateX(-50%)",
          color: "#00ADB5",
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        Hourly Traffic
        <span
          style={{ fontSize: "1.6rem", color: "#777777", display: "block" }}
        >
          Average User Traffic by Hour of the Day
        </span>
      </p>
      <ResponsiveContainer>
        <BarChart data={userCounts} margin={{ top: 80, right: 30, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="userCount" fill="#00ADB5" />
        </BarChart>
      </ResponsiveContainer>
      ;
      {userCounts.length < 1 && (
        <p
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            fontSize: "3rem",
            transform: "translate(-50%, -50%)",
            color: "#777777",
          }}
        >
          Not Enough Data
        </p>
      )}
    </>
  );
};

export default UserCountChart;
