import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import Heading from "../../common/components/headingIcon";
import { Form } from "react-router-dom";
import { FcAdvertising } from "react-icons/fc";

export default function AdsNew() {
  const classes = useStyles();
  const [fullName, setFullName] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [currentLength, setCurrentLength] = useState(1);
  const [currentTechnologies, setCurrentTechnologies] = useState("");
  const [headshot, setHeadshot] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      currentPosition,
      currentLength,
      currentTechnologies,
      headshot,
    });
  };
  return (
    <div>
      <Heading
        text="Create a new ad campaign"
        icon={<FcAdvertising />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
        iconStyle={{ fontSize: "3.2rem" }}
      />

      <div className={classes.app}>
        <p>Generate a resume with ChatGPT in few seconds</p>
        <Form
          onSubmit={handleFormSubmit}
          method="POST"
          encType="multipart/form-data"
          className={classes.form}
        >
          <label htmlFor="fullName" className={classes.label}>
            Enter your full name
          </label>
          <input
            type="text"
            required
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={classes.input}
          />
          <div className={classes.nestedContainer}>
            <div>
              <label htmlFor="currentPosition" className={classes.label}>
                Current Position
              </label>
              <input
                type="text"
                required
                name="currentPosition"
                className={`${classes.currentInput} ${classes.input}`}
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="currentLength" className={classes.label}>
                For how long? (year)
              </label>
              <input
                type="number"
                required
                name="currentLength"
                className={`${classes.currentInput} ${classes.input}`}
                value={currentLength}
                onChange={(e) => setCurrentLength(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="currentTechnologies" className={classes.label}>
                Technologies used
              </label>
              <input
                type="text"
                required
                name="currentTechnologies"
                className={`${classes.currentInput} ${classes.input}`}
                value={currentTechnologies}
                onChange={(e) => setCurrentTechnologies(e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="photo" className={classes.label}>
            Upload your headshot image
          </label>
          <input
            type="file"
            name="photo"
            required
            id="photo"
            accept="image/x-png,image/jpeg"
            onChange={(e) => setHeadshot(e.target.files[0])}
            className={classes.input}
          />

          <button className={classes.button}>CREATE RESUME</button>
        </Form>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    padding: "10px",
    width: "80%",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
  },
  input: {
    marginBottom: "15px",
    padding: "10px 20px",
    borderRadius: "3px",
    outline: "none",
    border: "1px solid #ddd",
    width: "95%",
  },
  nestedContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  currentInput: {
    width: "95%",
  },
  button: {
    padding: "15px",
    cursor: "pointer",
    outline: "none",
    backgroundColor: "#5d3891",
    border: "none",
    color: "#f5f5f5",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "3px",
  },
});
