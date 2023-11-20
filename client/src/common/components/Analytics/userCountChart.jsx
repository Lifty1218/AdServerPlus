import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const UserCountChart = ({ domainId }) => {
  const [userCounts, setUserCounts] = useState([]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/web_analytics/user_count/${domainId}`
        );
        setUserCounts(response.data);
      } catch (error) {
        console.error("Error retrieving user counts:", error);
      }
    };

    fetchUserCounts();
  }, [domainId]);

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
        Weekly Traffic Trend
        <span
          style={{ fontSize: "1.6rem", color: "#777777", display: "block" }}
        >
          User Traffic in the Past Seven Days
        </span>
      </p>
      <ResponsiveContainer>
        <LineChart
          data={userCounts}
          margin={{ top: 80, right: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="_id"
            tickFormatter={(date) => moment(date).format("MMM D")}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="userCount"
            stroke="#00ADB5"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
