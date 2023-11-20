import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SharedLogin from "../../common/components/sharedLogin";

export default function PublisherSignup() {
  const navigate = useNavigate();
  const currentPublisher = localStorage.getItem("publisher");
  const [publisher, setPublisher] = useState({
    email: "",
    name: "",
    dob: "",
    password: "",
  });
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (currentPublisher) {
      navigate("/publisher");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/publisher/register",
        publisher
      );
      if (res.status == 200) {
        localStorage.setItem("publisher", JSON.stringify(res.data));
        if (res.data.accountLink) {
          window.location.href = res.data.accountLink;
        } else {
          navigate("/publisher");
        }
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorText(error.response.data.name);
    }
  };

  return (
    <SharedLogin
      title="Publisher Signup"
      func={handleSubmit}
      user={publisher}
      setUser={setPublisher}
      login="/publisher/login"
      errorText={errorText}
    />
  );
}
