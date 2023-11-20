import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  btn: {
    padding: "1.6rem 2.8rem",
    backgroundColor: "#00adb5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.6rem",
    color: "#eee",
    fontSize: "1.4rem",
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative",
    zIndex: "30",
    boxShadow: "0 0.4rem 1rem rgba(0, 0, 0, 0.2)",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 1rem 1.8rem rgba(0, 0, 0, 0.2)",
    },
    "&:active": {
      transform: "translateY(-1px)",
      boxShadow: "0 0.6rem 1.4rem rgba(0, 0, 0, 0.2)",
    },
  },
  icon: { marginRight: "1.2rem", marginTop: ".3rem" },
  afterIcon: { marginLeft: "1rem", marginTop: ".3rem" },
});

export default function Button(props) {
  const classes = useStyles();
  return (
    <button onClick={props.func} style={props.style} className={classes.btn}>
      {props.icon && (
        <span className={classes.icon} style={props.iconStyle}>
          {props.icon}
        </span>
      )}
      {props.text}
      {props.afterIcon && (
        <span className={classes.afterIcon} style={props.iconStyle}>
          {props.afterIcon}
        </span>
      )}
    </button>
  );
}
