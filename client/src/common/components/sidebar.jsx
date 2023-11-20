import React from "react";
import { createUseStyles } from "react-jss";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Tooltip } from "@mui/material";
import Button from "./button";

import { useStateContext } from "../../context/context";

export default function Sidebar(props) {
  const classes = useStyles();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  // CLOSE SIDEBAR FOR MOBILE DEVICES
  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  // SIDEBAR LINKS
  function SideBarComponents(props) {
    return (
      <div>
        {props.title != null && (
          <p className={classes.linkTitle}>{props.title}</p>
        )}
        <NavLink
          to={`${props.link}`}
          onClick={handleCloseSideBar}
          className={({ isActive }) =>
            isActive ? classes.activeLink : classes.inactiveLink
          }
        >
          {props.icon}
          <span className={classes.linkText}>{props.name}</span>
        </NavLink>
      </div>
    );
  }

  return (
    <div className={classes.sidebar}>
      <div>
        <div className={classes.sidebarTop}>
          <Link
            to="/"
            onClick={handleCloseSideBar}
            className={classes.topTitle}
          >
            <span className="AdServerLogoText">AdServer Plus</span>
          </Link>
          <Tooltip title="Menu" placement="bottom">
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              // style={{ color: currentColor }}
              className={classes.sidebarButton}
            >
              <MdOutlineCancel />
            </button>
          </Tooltip>
        </div>
        <div>
          <div className={classes.sidebarBottom}>
            {props.sidebarComponents?.map((element, index) => (
              <SideBarComponents
                key={index}
                title={element.title}
                link={element.link}
                name={element.name}
                icon={element.icon}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={classes.logout}>
        {/* <button className={classes.logoutBtn}>Logout</button> */}
        <Button
          text="Logout"
          icon={<BiLogOut />}
          style={{ width: "100%", fontSize: "1.7rem", boxShadow: "none" }}
          iconStyle={{ marginTop: ".5rem", fontSize: "2rem" }}
          func={props.logoutFunc}
        />
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  sidebar: {
    flexBasis: "28rem",
    flexShrink: "0",
    backgroundColor: "#fff",
    overflow: "hidden",
    boxShadow: "0 .6rem 1.2rem rgba(0,0,0,0.3)",
    zIndex: "3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "0 .5rem",
    gap: "2rem",
  },
  linkTitle: {
    margin: "3rem 2rem 1rem",
    color: "#777777",
    fontSize: "1.5rem",
    lineHeight: "2rem",
    textTransform: "uppercase",
    letterSpacing: ".05rem",
    fontWeight: "bold",
  },
  activeLink: {
    display: "flex",
    paddingBottom: "1.4rem",
    paddingTop: "1.6rem",
    paddingLeft: "2.4rem",
    margin: "0.6rem .8rem",
    backgroundColor: "#00ADB5",
    color: "#ffffff",
    alignItems: "center",
    borderRadius: "0.5rem",
    gap: "1.5rem",
    fontSize: "1.35rem",
    boxShadow: "0 .25rem 1.25rem rgba(0,0,0,0.2)",
  },
  inactiveLink: {
    display: "flex",
    paddingBottom: "1.4rem",
    paddingTop: "1.6rem",
    paddingLeft: "2.4rem",
    color: "#8e8e8e",
    alignItems: "center",
    borderRadius: "0.5rem",
    gap: "1.35rem",
    fontSize: "1.5rem",
  },
  linkText: {
    letterSpacing: ".05rem",
  },
  sidebarBottom: {
    marginTop: "2rem",
  },
  sidebarTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: {
    display: "flex",
    marginLeft: "1.6rem",
    marginBottom: "2rem",
    marginTop: "3.75rem",
    fontSize: "2.5rem",
    fontWeight: "600",
    letterSpacing: "0.05rem",
    alignItems: "center",
    gap: "0.5rem",
    color: "#374151",
  },
  sidebarButton: {
    display: "block",
    padding: "0.75rem",
    marginTop: "2rem",
    fontSize: "2rem",
    lineHeight: "1rem",
    borderRadius: "100%",
    color: "#374151",
    marginRight: "1rem",
    backgroundColor: "#fff",
  },
  logout: {
    padding: "2rem",
    color: "#eee",
    textAlign: "center",
    fontSize: "1.45rem",
  },
});
