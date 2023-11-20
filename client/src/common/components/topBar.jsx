import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { Tooltip } from "@mui/material";
import { AiOutlineMenu, AiTwotoneSetting } from "react-icons/ai";
import { TbCash } from "react-icons/tb";
import { useStateContext } from "../../context/context";
import avatar from "../../assets/avatar.jpg";

export default function TopBar({
  userName,
  imageURL,
  accountFunds,
  profileLink,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const {
    activeMenu,
    setActiveMenu,
    setScreenSize,
    screenSize,
    profileClicked,
    setProfileClicked,
  } = useStateContext();

  // CHANGE screenSize STATE, WHENEVER WINDOW WIDTH IS CHANGED
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // CLOSE MENU FOR MOBILE SIZE DEVICES
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className={classes.topBar} id="topBar">
      {!activeMenu && (
        <Tooltip title="Menu" placement="bottom">
          <button
            type="button"
            onClick={handleActiveMenu}
            className={classes.menu}
          >
            <AiOutlineMenu />
          </button>
        </Tooltip>
      )}

      <div className={classes.profileContainer}>
        {accountFunds && (
          <Tooltip title="Wallet" placement="bottom">
            <div
              className={classes.profile}
              onClick={() => handleClick("userProfile")}
              style={{
                marginRight: "2rem",
              }}
            >
              <p className={classes.walletText}>
                <span style={{ marginRight: ".8rem", fontSize: "2.5rem" }}>
                  <TbCash />
                </span>
                {accountFunds.amount / 100 +
                  " " +
                  accountFunds.currency.toUpperCase()}
              </p>
            </div>
          </Tooltip>
        )}

        {profileLink && (
          <Tooltip title="Account Settings" placement="bottom">
            <div
              className={classes.profile}
              onClick={() => navigate(profileLink)}
              style={{
                marginRight: "2rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", color: "#898a8c" }}>
                <AiTwotoneSetting />
              </span>
            </div>
          </Tooltip>
        )}

        <Tooltip title="Profile" placement="bottom">
          <div
            className={classes.profile}
            onClick={() => setProfileClicked(!profileClicked)}
          >
            <img
              className={classes.profileAvatar}
              src={imageURL ? imageURL : avatar}
              alt="user-profile"
            />
            <p className={classes.profileTextBold}>
              {userName ? userName : "user"}
            </p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  topBar: {
    display: "flex",
    position: "relative",
    padding: "1.3rem 1.6rem 1.3rem 2.4rem",
    justifyContent: "space-between",
    boxShadow: ".5rem 0 1rem rgba(0,0,0,0.2)",
    zIndex: "2",
    alignItems: "center",
  },
  profileContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  profile: {
    display: "flex",
    padding: "0.4rem",
    fontSize: "1.25rem",
    lineHeight: "1.9rem",
    alignItems: "center",
    borderRadius: "0.5rem",
    cursor: "pointer",
    gap: "0.5rem",
    marginRight: "1rem",
  },
  profileAvatar: {
    width: "4rem",
    height: "4rem",
    borderRadius: "100%",
  },
  profileText: {
    color: "#9CA3AF",
  },
  profileTextBold: {
    marginLeft: "0.5rem",
    color: "#9CA3AF",
    fontWeight: "700",
  },
  walletText: {
    fontSize: "1.8rem",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  menu: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "1.2rem",
    fontSize: "2rem",
    borderRadius: "100%",
    width: "4.25rem",
    height: "4.25rem",
    backgroundColor: "#e8e8e8",
    color: "#374151",
    boxShadow: "0 .3rem .6rem rgba(0,0,0,0.3)",
  },
});
