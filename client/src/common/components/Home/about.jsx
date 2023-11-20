import React from "react";
import { IoMdInformationCircle } from "react-icons/io";

import "./about.css";
import peopleGif from "../../../assets/people.gif";
import handShakeGif from "../../../assets/handshake.gif";
import graphGif from "../../../assets/graph.gif";
import IconHeading from "../headingIcon";

function AboutInfo(props) {
  return (
    <div className="about-item">
      <div className="about-item-head">
        <img src={props.img} alt={props.alt} className="about-item-img" />
        <span className="about-item-heading">{props.heading}</span>
      </div>
      <p className="about-item-para">{props.para}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="about-container" id="About">
      {/* <h2 className="about-heading">About Us</h2> */}
      <IconHeading
        text="About Us"
        icon={<IoMdInformationCircle />}
        headingStyle={{ color: "#222831", fontSize: '3.6rem', marginBottom: '5rem' }}
      />
      <div className="about-list">
        <AboutInfo
          heading="Who are we"
          para="We are a small team of developers who are passionate about creating innovative solutions to help businesses grow."
          img={peopleGif}
        />

        <AboutInfo
          heading="What we do"
          para="Our ad network connects advertisers with publishers, enabling them to reach their target audience and helps manage and optimize ad campaigns."
          img={handShakeGif}
        />

        <AboutInfo
          heading="Why we do it"
          para="We believe that advertising is an essential part of any business strategy, and we want to make it easy and accessible for everyone."
          img={graphGif}
        />
      </div>
    </div>
  );
}
