import React from "react";
import { CirclesWithBar } from "react-loader-spinner";
import { createUseStyles } from "react-jss";

const LoadingSpinner = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.loader}>
      <CirclesWithBar color="#00ADB5" height={120} width={120} />
      {props.text && <span className={classes.text}>{props.text}</span>}
    </div>
  );
};

export default LoadingSpinner;

const useStyles = createUseStyles({
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(0,0,0,0.1)",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
    gap: "4rem",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "100",
  },
  text: {
    fontSize: "3.5rem",
    color: "#8e8e8e",
  },
});
