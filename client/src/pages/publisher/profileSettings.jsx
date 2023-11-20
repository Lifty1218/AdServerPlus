import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createUseStyles } from "react-jss";
import { AiOutlineClose } from "react-icons/ai";
import { Form } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBirthdayCake,
  FaUpload,
} from "react-icons/fa";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProfileSettings = () => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentPublisher = JSON.parse(localStorage.getItem("publisher"));
  const [formState, setFormState] = useState({
    name: currentPublisher.name,
    email: currentPublisher.email,
    dob: currentPublisher.dob,
    imageURL: currentPublisher.imageURL,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFilePreview, setImageFilePreview] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const onDragEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0]);
      setImageFilePreview(URL.createObjectURL(acceptedFiles[0]));
      setFormState({ ...formState, imageURL: acceptedFiles[0] });
      setIsDragActive(false);
    },
    onDragEnter,
    onDragLeave,
  });

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      currentPublisher.name != formState.name ||
      currentPublisher.dob != formState.dob ||
      currentPublisher.imageURL != formState.imageURL
    ) {
      const formData = new FormData();
      if (currentPublisher.name != formState.name) {
        formData.append("name", formState.name);
      }
      if (currentPublisher.dob != formState.dob) {
        formData.append("dob", formState.dob);
      }
      if (currentPublisher.imageURL != formState.imageURL) {
        formData.append("adImage", imageFile);
      }
      try {
        setIsLoading(true);
        const response = await axios.post(
          `http://localhost:5000/publisher/upload/${currentPublisher._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        localStorage.setItem("publisher", JSON.stringify(response.data));
        setSuccessText("Successfully Updated the Profile");
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No changes detected in user information");
    }
  };

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword == newPasswordConfirm) {
        setErrorText("");
        await axios.put("http://localhost:5000/publisher/change/password", {
          email: currentPublisher.email,
          password: currentPassword,
          newPassword: newPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setSuccessText("Password Successfully Changed");
      } else {
        setErrorText("Passwords don't match, please confirm you password");
      }
    } catch (error) {
      console.log(error);
      if (error.message == "Request failed with status code 401") {
        setErrorText("Wrong Password, please try again");
      }
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className={classes.dropzone}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <input {...getInputProps()} />
          {imageFilePreview ? (
            <img
              src={imageFilePreview}
              alt="Profile"
              className={classes.image}
            />
          ) : (
            <img
              src={formState.imageURL}
              alt="Profile"
              className={classes.image}
            />
          )}
          <div
            className={`${classes.uploadIcon} ${
              isDragActive ? classes.uploadIconActive : ""
            }`}
          >
            <FaUpload />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <FaUser className={classes.icon} />
          <input
            className={classes.input}
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div
          className={classes.inputGroup}
          style={{ backgroundColor: "#eeeeee" }}
        >
          <FaEnvelope className={classes.icon} />
          <input
            style={{ backgroundColor: "#eeeeee" }}
            className={classes.input}
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="Email"
            disabled
          />
        </div>
        <div className={classes.inputGroup}>
          <FaBirthdayCake className={classes.icon} />
          <input
            className={classes.input}
            name="dob"
            value={formState.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            type="date"
            required
          />
        </div>
        {successText && (
          <div style={{ textAlign: "center" }}>
            <span className={classes.errorText} style={{ color: "#4bb543" }}>
              {successText}
            </span>
          </div>
        )}
        <button type="submit" className={classes.submitButton}>
          {isLoading ? "Updating..." : "Update Profile"}
          {isLoading && (
            <span style={{ marginLeft: "2rem" }}>
              <TailSpin color="#fff" height={25} width={25} />
            </span>
          )}
        </button>
        {!currentPublisher.googleId && (
          <button
            className={classes.submitButton}
            onClick={() => {
              setSuccessText("");
              setIsModalOpen(true);
            }}
          >
            Change Password
          </button>
        )}
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalOverlayClick}
        shouldCloseOnOverlayClick={true}
        className={classes.content}
        overlayClassName={classes.overlay}
      >
        <button
          style={{ fontSize: "1.8rem", backgroundColor: "inherit" }}
          onClick={handleModalClose}
        >
          <AiOutlineClose />
        </button>
        <div className={classes.innerModal}>
          <h2
            style={{
              fontSize: "2rem",
              textTransform: "uppercase",
              marginBottom: "2.2rem",
            }}
          >
            Enter password details
          </h2>
          <Form onSubmit={handlePasswordChange} className={classes.innerForm}>
            <label htmlFor="currentPassword" className={classes.label2}>
              Current Password:
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={classes.input2}
              placeholder="Your Current Password"
              required
            />

            <label htmlFor="newPassword" className={classes.label2}>
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={classes.input2}
              placeholder="Your New Password"
              required
            />

            <label htmlFor="newPasswordConfirm" className={classes.label2}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className={classes.input2}
              placeholder="Confirm Your New Password"
              required
            />

            {errorText && (
              <div style={{ textAlign: "center" }}>
                <span className={classes.errorText}>{errorText}</span>
              </div>
            )}

            {successText && (
              <div style={{ textAlign: "center" }}>
                <span
                  className={classes.errorText}
                  style={{ color: "#4bb543" }}
                >
                  {successText}
                </span>
              </div>
            )}

            <button
              type="submit"
              className={classes.submitButton}
              style={{ margin: ".5rem 0", padding: "1.5rem 0" }}
            >
              Submit
            </button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "45%",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    margin: "1.2rem 0",
    padding: "1rem 1rem 1rem 2rem",
    fontSize: "1.6rem",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
  },
  icon: {
    marginRight: "1rem",
    color: "#424242",
  },
  input: {
    border: "none",
    outline: "none",
    flex: "1",
    fontSize: "1.6rem",
    padding: "1rem",
    color: "#6b6b6b",
  },
  dropzone: {
    position: "relative",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    margin: "20px 0",
    alignSelf: "center",
  },
  uploadIcon: {
    position: "absolute",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    opacity: 0,
    transition: "opacity 0.3s",
    fontSize: "2rem",
  },
  uploadIconActive: {
    opacity: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  submitButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00ADB5",
    color: "#fff",
    padding: "2rem 0",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    marginTop: "2rem",
    fontSize: "1.6rem",
    transition: "all .2s",
    "&:hover": {
      backgroundColor: "#374151",
    },
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    padding: "2rem 3rem 4rem",
    background: "#FFFFFF",
    boxShadow: "0px .4rem .8rem rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(rgba(34, 40, 49, 0.3),rgba(57, 62, 70, 0.3))",
    zIndex: "9999",
  },
  innerModal: {
    textAlign: "center",
    width: "100%",
  },
  innerForm: {
    display: "flex",
    flexDirection: "column",
    padding: "0  2rem",
  },
  input2: {
    backgroundColor: "#eee",
    border: "none",
    padding: "1.2rem 2rem",
    margin: ".5rem 0 2.5rem",
    fontSize: "1.5rem",
    outline: "none",
    width: "35rem",
  },
  label2: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    alignSelf: "flex-start",
    margin: "0 .3rem",
  },
  errorText: {
    display: "block",
    marginBottom: "1.6rem",
    color: "#DC2626",
    fontSize: "1.4rem",
    lineHeight: "1.6rem",
  },
});

export default ProfileSettings;
