import React, { useEffect } from "react";
import axios from "axios";
import { createUseStyles } from "react-jss";
import { Outlet } from "react-router-dom";
import { RiAdvertisementFill } from "react-icons/ri";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useStateContext } from "../../context/context";
import Sidebar from "../../common/components/sidebar";
import TopBar from "../../common/components/topBar";

function AdvertiserDashboard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { activeMenu } = useStateContext();
  const currentAdvertiser = JSON.parse(localStorage.getItem("advertiser"));

  useEffect(() => {
    if (!currentAdvertiser) {
      navigate("/advertiser/login");
    }
  }, []);

  const handleLogout = async () => {
    console.log("logout");
    try {
      const res = await axios.get("http://localhost:5000/advertiser/logout");
      if (res.status == 200) {
        console.log(res.data);
        localStorage.removeItem("advertiser");
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data);
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
      title: "Manage Ads",
      link: "ads_new",
      name: "New Ad Campaign",
      icon: <FaPlusCircle />,
    },
    {
      link: "ads",
      name: "View Your Ads",
      icon: <RiAdvertisementFill />,
    },
    {
      title: "Ad Maker",
      link: "ad_maker",
      name: "Create New Ads",
      icon: <RiAdvertisementFill />,
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
          userName={currentAdvertiser ? currentAdvertiser.name : "user"}
          imageURL={currentAdvertiser ? currentAdvertiser.imageURL : null}
          profileLink="/advertiser/profile"
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
    backgroundColor: "#F0F1F6",
    flex: "1",
    position: "relative",
  },
});

export default AdvertiserDashboard;
