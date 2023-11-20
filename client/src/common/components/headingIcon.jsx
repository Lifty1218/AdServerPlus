import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  heading: {
    fontSize: "3.2rem",
    marginBottom: "2rem",
    textTransform: "uppercase",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { marginRight: "1.2rem", marginTop: '.5rem' },
});

export default function HeadingIcon({ icon, headingStyle, iconStyle, text }) {
  const classes = useStyles();
  return (
    <h2 className={classes.heading} style={headingStyle}>
      {icon && (
        <span className={classes.icon} style={iconStyle}>
          {icon}
        </span>
      )}
      {text}
    </h2>
  );
}
