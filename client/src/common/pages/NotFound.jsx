import React from "react";
import { useRouteError } from "react-router-dom";
import image from "../../assets/404.gif";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page" style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Oops!</h1>
      <img src={image} />
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
