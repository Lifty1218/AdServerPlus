import React from "react";
import "./button.css";

export default function Button(props) {
  return (
    <button onClick={props.func} style={props.style} className={`custom-btn-shadow ${props.class}`}>
      {props.icon != null && (
        <i className={`custom-btn-icon fa-solid fa-${props.icon}`}></i>
      )}
      {props.text}
      {props.afterIcon != null && (
        <i className={`custom-btn-afterIcon fa-solid fa-${props.afterIcon}`}></i>
      )}
    </button>
  );
}
