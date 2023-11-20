import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo-box">
        <a href="#" className="logo footer-logo">
          AdServer Plus
        </a>
      </div>
      <div className="footer-container-main">
        <div className="footer-container left-container">
          <div className="footer__navigation">
            <ul className="footer__list">
              <li className="footer__list-item">
                <a href="#" className="footer__link">
                  Company
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__link">
                  Contact Us
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__link">
                  Careers
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__link">
                  Privacy Policy
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__link">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-container right-container">
          <p className="footer__copyright">
            Copyright ©. All rights reserved Lorem ipsum dolor sit amet
            consectetur.
          </p>
        </div>
      </div>
    </footer>
  );
}
