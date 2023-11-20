import React from "react";
import "./button.css";

export default function Button(props) {
  return (
    <button onClick={props.func} className={`custom-btn ${props.class}`}>
      {props.icon != null ? (
        <i className={`custom-btn-icon fa-solid fa-${props.icon}`}></i>
      ) : null}
      {props.text}
    </button>
  );
}
