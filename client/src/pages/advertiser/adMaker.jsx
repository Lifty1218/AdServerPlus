import React, { useEffect, useState } from "react";
import Sidebar from "../../common/components/AdMaker/Sidebar";
import Canvas from "../../common/components/AdMaker/Canvas";
import RightSideBar from "../../common/components/AdMaker/RightSideBar";
import { useStateContext } from "../../context/context";
import "../../ad-maker.css";
import Modal from "react-modal";
import { createUseStyles } from "react-jss";
import { AiOutlineClose } from "react-icons/ai";
import { Form } from "react-router-dom";

Modal.setAppElement("#root");

const AdMaker = () => {
  const {
    canvasObject,
    setSelectedObject,
    canvasColor,
    setSelectedTool,
    setActiveMenu,
    canvasDimensions,
    setCanvasDimensions,
  } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [width, setWidth] = useState(canvasDimensions.width);
  const [height, setHeight] = useState(canvasDimensions.height);
  const classes = useStyles();

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCanvasDimensions({
      height: height,
      width: width,
    });
    canvasObject.setWidth(width);
    canvasObject.setHeight(height);
    canvasObject.renderAll();
    setIsModalOpen(false);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const topBar = document.getElementById("topBar");
  let topBarHeight = 0;
  if (topBar) {
    topBarHeight = topBar.offsetHeight;
  }

  useEffect(() => {
    setActiveMenu(false);
  }, []);

  const handleEmptyAreaClick = () => {
    if (canvasObject) {
      canvasObject.discardActiveObject();
      canvasObject.isDrawingMode = false;
      setSelectedObject(null);
      setSelectedTool(null);
      canvasObject.renderAll();
    }
  };
  return (
    <div className="parent-container">
      <Sidebar topBarHeight={topBarHeight} />
      <div className="canvas-parent" onClick={handleEmptyAreaClick}>
        <div
          className="canvas-sub-parent"
          style={{ backgroundColor: canvasColor }}
          onClick={(event) => event.stopPropagation()}
        >
          <Canvas />
        </div>
      </div>
      <RightSideBar
        topBarHeight={topBarHeight}
        handleChangeCanvasSize={handleButtonClick}
      />

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
            Enter Canvas Size
          </h2>
          <Form onSubmit={handleSubmit} className={classes.innerForm}>
            <label htmlFor="canvasWidth" className={classes.label}>
              Width:
            </label>
            <input
              type="number"
              id="canvasWidth"
              name="canvasWidth"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className={classes.input}
              required
            />

            <label htmlFor="canvasHeight" className={classes.label}>
              Height:
            </label>
            <input
              type="number"
              id="canvasHeight"
              name="canvasHeight"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={classes.input}
              required
            />

            <button
              type="submit"
              style={{
                padding: "1.2rem 3.6rem",
                backgroundColor: "#00ADB5",
                color: "#eee",
                fontSize: "1.6rem",
                borderRadius: ".3rem",
              }}
            >
              Change
            </button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AdMaker;

const useStyles = createUseStyles({
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
  input: {
    backgroundColor: "#eee",
    border: "none",
    padding: "1.2rem 2rem",
    margin: ".5rem 0 2.5rem",
    outline: "none",
    width: "30rem",
  },
  label: {
    fontSize: "1.4rem",
    alignSelf: "flex-start",
    margin: "0 .3rem",
  },
});
