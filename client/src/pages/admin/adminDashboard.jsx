import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { Outlet } from "react-router-dom";
import { FaUserTie, FaUserEdit } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { RiAdvertisementFill } from "react-icons/ri";
import { FiHelpCircle } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { MdPayments } from "react-icons/md";

import { useStateContext } from "../../context/context";
import Sidebar from "../../common/components/sidebar";
import TopBar from "../../common/components/topBar";

export default function AdminDashboard() {
  const classes = useStyles();
  const navigate = useNavigate();
  const currentAdmin = JSON.parse(localStorage.getItem("admin"));
  const { activeMenu } = useStateContext();

  useEffect(() => {
    if (!currentAdmin) {
      navigate("/admin/login");
    }
  }, []);

  const sidebarComponents = [
    {
      title: "Dashboard",
      link: "dashboard",
      name: "Dashboard",
      icon: <AiOutlineDashboard />,
    },
    {
      title: "Manage Users",
      link: "advertisers",
      name: "Advertisers",
      icon: <FaUserTie />,
    },
    {
      link: "publishers",
      name: "Publishers",
      icon: <FaUserEdit />,
    },
    {
      title: "Manage Ads",
      link: "ads",
      name: "Ads",
      icon: <RiAdvertisementFill />,
    },
    {
      title: "Manage Domains",
      link: "domains",
      name: "Domains",
      icon: <CgWebsite />,
    },
    {
      link: "ad_spaces",
      name: "Ad Spaces",
      icon: <CgWebsite />,
    },
    {
      title: "Manage Payments",
      link: "advertiser_payments",
      name: "Advertiser Payments",
      icon: <MdPayments />,
    },
    {
      link: "publisher_payments",
      name: "Publisher Payments",
      icon: <MdPayments />,
    },
    {
      title: "User Assistance",
      link: "advertiser_assistance",
      name: "Advertisers",
      icon: <FiHelpCircle />,
    },
    {
      link: "publisher_assistance",
      name: "Publishers",
      icon: <FiHelpCircle />,
    },
  ];

  const handleLogout = async () => {
    console.log("logout admin");
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className={classes.main}>
      {activeMenu && (
        <Sidebar
          sidebarComponents={sidebarComponents}
          logoutFunc={handleLogout}
        />
      )}
      <div className={classes.content}>
        <TopBar userName={currentAdmin ? currentAdmin.name : "user"} />
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
  },
});
