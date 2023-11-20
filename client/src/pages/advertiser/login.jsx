import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import SharedLogin from "../../common/components/sharedLogin";

export default function AdvertiserLogin() {
  const navigate = useNavigate();
  const currentAdvertiser = localStorage.getItem("advertiser");
  const [advertiser, setAdvertiser] = useState({
    email: "",
    password: "",
  });
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (currentAdvertiser) {
      navigate("/advertiser");
    }
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.id) {
      localStorage.setItem(
        "advertiser",
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
      navigate("/advertiser");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/advertiser/auth",
        advertiser
      );
      if (res.status == 200) {
        localStorage.setItem("advertiser", JSON.stringify(res.data));
        navigate("/advertiser");
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorText(error.response.data);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:5000/advertiser/auth/google", "_self");
  };

  return (
    <SharedLogin
      title="Advertiser Login"
      func={handleSubmit}
      user={advertiser}
      googleAuthFunc={googleAuth}
      setUser={setAdvertiser}
      errorText={errorText}
      signup="/advertiser/register"
    />
  );
}
