import React from "react";
import { MdDesignServices } from "react-icons/md";
import "./features.css";

import IconHeading from "../headingIcon";

function FeatureBox(props) {
  return (
    <div className="feature-box">
      <i className={`fa-solid feature-box-icon fa-${props.icon}`}></i>
      <h3 className="feature-box-heading">{props.heading}</h3>
      <p className="feature-box__text">{props.text}</p>
    </div>
  );
}

export default function Features() {
  return (
    <div className="features-container" id="Features">
      <IconHeading
        text="Features"
        icon={<MdDesignServices />}
        headingStyle={{
          color: "#fff",
          fontSize: "3.6rem",
          marginBottom: "7rem",
        }}
      />
      <div className="features">
        <FeatureBox
          heading="Secure"
          text="We constantly work on improving our system and level of our security."
          icon="unlock-keyhole"
        />

        <FeatureBox
          heading="24/7 Support"
          text="We are here for you. We provide 24/7 customer support."
          icon="headset"
        />

        <FeatureBox
          heading="Certified"
          text="We are a certified company operating a fully legal business."
          icon="certificate"
        />

        <FeatureBox
          heading="Profitable"
          text="Easy to make money and withdraw within minutes."
          icon="money-bill-wave"
        />
      </div>
    </div>
  );
}
