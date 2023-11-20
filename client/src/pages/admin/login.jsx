import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import SharedLogin from "../../common/components/sharedLogin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    name: "",
    password: "",
  });
  const currentAdmin = localStorage.getItem("admin");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (currentAdmin) {
      navigate("/admin");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/admin/auth", admin);
      if (res.status == 200) {
        localStorage.setItem(
          "admin",
          JSON.stringify({
            name: "admin",
          })
        );
        navigate("/admin");
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorText(error.response.data);
    }
  };

  return (
    <SharedLogin
      title="Admin Login"
      func={handleSubmit}
      user={admin}
      setUser={setAdmin}
      errorText={errorText}
    />
  );
}
