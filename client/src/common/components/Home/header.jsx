import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie, FaUserEdit } from "react-icons/fa";
import "./header.css";

import CustomButton from "./button";
import useScript from "../../../Hooks/useScript";

export default function Header() {
  useScript("/Scripts/header.js");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  function handleDropdownClick() {
    setIsDropdownOpen((prevState) => !prevState);
  }

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/" className="logo">
          AdServer Plus
        </Link>
      </div>
      <div className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="#Home" className="nav-link">
              home
            </a>
          </li>
          <li className="nav-item">
            <a href="#About" className="nav-link">
              about
            </a>
          </li>
          <li className="nav-item">
            <a href="#Features" className="nav-link">
              features
            </a>
          </li>
          <li className="nav-item">
            <a href="#Contact" className="nav-link">
              contact
            </a>
          </li>
        </ul>
      </div>
      <div className="header-login">
        <CustomButton
          text="LOGIN"
          afterIcon="arrow-right-to-bracket"
          func={handleDropdownClick}
          style={{ padding: "1.6rem 3.4rem" }}
        />
        {isDropdownOpen && (
          <div className="dropdown">
            {/* Dropdown content */}
            <Link className="dropdown-item" to="/advertiser/login">
              <FaUserTie className="dropdown-icon" />
              Advertiser Login
            </Link>
            <Link className="dropdown-item" to="/publisher/login">
              <FaUserEdit className="dropdown-icon" />
              Publisher Login
            </Link>
          </div>
        )}
      </div>
      <button className="nav-btn">
        <span className="nav-icon"> &nbsp; </span>
      </button>
    </header>
  );
}
