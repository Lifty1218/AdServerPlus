import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SharedLogin from "../../common/components/sharedLogin";

export default function AdvertiserSignup() {
  const navigate = useNavigate();
  const currentAdvertiser = localStorage.getItem("advertiser");
  const [advertiser, setAdvertiser] = useState({
    email: "",
    name: "",
    dob: "",
    password: "",
  });
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (currentAdvertiser) {
      navigate("/advertiser");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/advertiser/register",
        advertiser
      );
      if (res.status == 200) {
        localStorage.setItem("advertiser", JSON.stringify(res.data));
        navigate("/advertiser");
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorText(error.response.data.name);
    }
  };

  return (
    <SharedLogin
      title="Advertiser Signup"
      func={handleSubmit}
      user={advertiser}
      setUser={setAdvertiser}
      login="/advertiser/login"
      errorText={errorText}
    />
  );
}
