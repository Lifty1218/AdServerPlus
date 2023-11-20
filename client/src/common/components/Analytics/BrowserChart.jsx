import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const BrowserChart = ({ domainId }) => {
  const [userData, setUserData] = useState([]);
  const COLORS = ["#00ADB5", "#8d7cef", "#F08A5D", "#374151"];

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/web_analytics/users_by_browser/${domainId}`
        );

        const chartArray = response.data.map((element) => {
          return {
            name: element.browser,
            value: parseFloat(element.percentage.toFixed(2)),
          };
        });
        setUserData(chartArray);
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
          >{`${payload[0].name} : ${payload[0].value}%`}</p>
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
        Browser Distribution
        <span
          style={{ fontSize: "1.6rem", color: "#777777", display: "block" }}
        >
          Percentage of User Traffic by Browser
        </span>
      </p>
      <ResponsiveContainer>
        <PieChart margin={{ top: 40, bottom: 10 }}>
          <Pie
            data={userData}
            // innerRadius={80}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
          >
            {userData.map((entry, index) => (
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
      {userData.length < 1 && (
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
    </>
  );
};

export default BrowserChart;
