import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import SharedLogin from "../../common/components/sharedLogin";

export default function PublisherLogin() {
  const navigate = useNavigate();
  const currentPublisher = localStorage.getItem("publisher");
  const [publisher, setPublisher] = useState({
    email: "",
    password: "",
  });
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (currentPublisher) {
      navigate("/publisher");
    }
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.id) {
      localStorage.setItem(
        "publisher",
        JSON.stringify({
          _id: params.id,
          name: params.name,
          email: params.email,
          dob: params.dob,
          imageURL: params.imageURL,
          stripeId: params.stripeId,
          googleId: params.googleId,
        })
      );
      navigate("/publisher");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/publisher/auth",
        publisher
      );
      if (res.status == 200) {
        localStorage.setItem("publisher", JSON.stringify(res.data));
        navigate("/publisher");
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorText(error.response.data);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:5000/publisher/auth/google", "_self");
  };

  return (
    <SharedLogin
      title="Publisher Login"
      func={handleSubmit}
      user={publisher}
      googleAuthFunc={googleAuth}
      setUser={setPublisher}
      errorText={errorText}
      signup="/publisher/register"
    />
  );
}
