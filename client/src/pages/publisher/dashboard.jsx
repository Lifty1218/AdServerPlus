import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { Outlet } from "react-router-dom";
import { RiAdvertisementFill } from "react-icons/ri";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { FaPlusCircle } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdOutlinePublishedWithChanges } from "react-icons/md";

import { useStateContext } from "../../context/context";
import Sidebar from "../../common/components/sidebar";
import TopBar from "../../common/components/topBar";

function PublisherDashboard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { activeMenu } = useStateContext();
  const [accountFunds, setAccountFunds] = useState("");
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));
  useEffect(() => {
    if (!currentPublisher) {
      navigate("/publisher/login");
    } else {
      fetchAccountBalance();
    }
  }, []);

  const handleLogout = async () => {
    console.log("logout");
    try {
      const res = await axios.get("http://localhost:5000/publisher/logout");
      if (res.status == 200) {
        console.log(res.data);
        localStorage.removeItem("publisher");
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fetchAccountBalance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/publisher/account_funds/${currentPublisher._id}`
      );
      setAccountFunds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sidebarComponents = [
    {
      title: "Dashboard",
      link: "dashboard",
      name: "Dashboard",
      icon: <AiOutlineDashboard />,
    },
    {
      title: "Manage Domains",
      link: "domains",
      name: "Your Domains",
      icon: <CgWebsite />,
    },
    {
      title: "Manage Ad Spaces",
      link: "ad_spaces_new",
      name: "Add an Ad Space",
      icon: <FaPlusCircle />,
    },
    {
      link: "ad_spaces",
      name: "Your Ad Spaces",
      icon: <RiAdvertisementFill />,
    },
    {
      title: "Manage Ads",
      link: "ad_requests",
      name: "Ad Placement Requests",
      icon: <MdOutlinePublishedWithChanges />,
    },
    {
      title: "Help",
      link: "assistance",
      name: "User Assistance",
      icon: <FiHelpCircle />,
    },
  ];

  return (
    <div className={classes.main}>
      {activeMenu && (
        <Sidebar
          sidebarComponents={sidebarComponents}
          logoutFunc={handleLogout}
        />
      )}
      <div className={classes.content}>
        <TopBar
          userName={currentPublisher ? currentPublisher.name : "user"}
          imageURL={currentPublisher ? currentPublisher.imageURL : null}
          accountFunds={
            accountFunds
              ? accountFunds
              : { amount: 0, currency: "usd", source_types: { card: 0 } }
          }
          profileLink="/publisher/profile"
        />
        <div className={classes.dashboardOutlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  main: {
    display: "flex",
    minHeight: "100vh",
  },
  content: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
  dashboardOutlet: {
    padding: "2.5rem 5%",
    backgroundColor: "#F0F1F6",
    flex: "1",
    position: "relative",
  },
});

export default PublisherDashboard;
