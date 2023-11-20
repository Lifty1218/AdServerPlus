import React, { useState } from "react";
import { useStateContext } from "../../../context/context";
import { AiOutlineClear } from "react-icons/ai";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import Filters from "./Filters";
import ShapeDetails from "./ShapeDetails";
import TextEditor from "./TextEditor";
import SaveExport from "./SaveExport";
import PencilDetails from "./PencilDetails";
import EraserDetails from "./EraserDetails";

export default function RightSideBar({ topBarHeight, handleChangeCanvasSize }) {
  const {
    canvasObject,
    setCanvasColor,
    canvasColor,
    selectedObject,
    selectedTool,
    canvasDimensions,
  } = useStateContext();
  const [expandedSections, setExpandedSections] = useState([
    "shape-details",
    "filters",
    "canvas",
    "pencil",
    "text",
    "eraser",
  ]);
  const [color, setColor] = useState(canvasColor);

  const height = `calc(100vh - ${topBarHeight}px)`;

  const handleHeadingClick = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((sec) => sec !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const handleClearCanvas = () => {
    if (canvasObject) {
      canvasObject.clear();
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    setCanvasColor(e.target.value);
  };

  return (
    <div className="right-sidebar" style={{ height }}>
      <h2
        onClick={() => handleHeadingClick("canvas")}
        className="expand-heading sidebar-heading"
      >
        Canvas
        {expandedSections.includes("canvas") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("canvas") ? "expanded2" : ""
        }`}
        style={{ padding: "0 .5rem" }}
      >
        <h2 className="sidebar-heading-sub">Size</h2>
        <div className="shape-details-container">
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="canvasWidth">
              Width:
            </label>
            <input
              type="number"
              id="canvasWidth"
              className="shape-details-input"
              value={canvasDimensions.width}
              // onChange={(e) =>
              //   setCanvasDimensions((prevValues) => ({
              //     ...prevValues,
              //     width: parseInt(e.target.value),
              //   }))
              // }
              disabled
            />
          </div>
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="canvasHeight">
              Height:
            </label>
            <input
              type="number"
              id="canvasHeight"
              className="shape-details-input"
              value={canvasDimensions.height}
              // onChange={(e) =>
              //   setCanvasDimensions((prevValues) => ({
              //     ...prevValues,
              //     height: parseInt(e.target.value),
              //   }))
              // }
              disabled
            />
          </div>
          <div className="shape-details-inner-container">
            <button
              onClick={handleChangeCanvasSize}
              className="add-text-button"
              style={{ marginBottom: "1rem" }}
            >
              Change Size
            </button>
          </div>
        </div>
        <h2 className="sidebar-heading-sub">Color</h2>
        <div className="shape-details-container">
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="fill">
              Fill:
            </label>
            <input
              type="color"
              id="fill"
              className="shape-details-input color-input"
              value={color}
              onChange={handleColorChange}
            />
          </div>
        </div>
        <button
          onClick={handleClearCanvas}
          className="clear-button"
          style={{ marginTop: "1.5rem" }}
        >
          Clear Canvas
          <span className="sidebar-button-icon2" style={{ fontSize: "1.8rem" }}>
            <AiOutlineClear />
          </span>
        </button>
      </div>

      {selectedObject && selectedObject.type == "image" && (
        <Filters
          handleHeadingClick={handleHeadingClick}
          expandedSections={expandedSections}
          MdExpandMore={MdExpandMore}
          MdExpandLess={MdExpandLess}
        />
      )}

      {selectedObject &&
        (selectedObject.type == "rect" ||
          selectedObject.type == "circle" ||
          selectedObject.type == "triangle" ||
          selectedObject.type == "ellipse") && (
          <ShapeDetails
            handleHeadingClick={handleHeadingClick}
            expandedSections={expandedSections}
            MdExpandMore={MdExpandMore}
            MdExpandLess={MdExpandLess}
          />
        )}

      {selectedTool && selectedTool == "pencil" && (
        <PencilDetails
          handleHeadingClick={handleHeadingClick}
          expandedSections={expandedSections}
          MdExpandMore={MdExpandMore}
          MdExpandLess={MdExpandLess}
        />
      )}

      {selectedTool && selectedTool == "eraser" && (
        <EraserDetails
          handleHeadingClick={handleHeadingClick}
          expandedSections={expandedSections}
          MdExpandMore={MdExpandMore}
          MdExpandLess={MdExpandLess}
        />
      )}

      <TextEditor
        handleHeadingClick={handleHeadingClick}
        expandedSections={expandedSections}
        MdExpandMore={MdExpandMore}
        MdExpandLess={MdExpandLess}
      />

      <SaveExport
        handleHeadingClick={handleHeadingClick}
        expandedSections={expandedSections}
        MdExpandMore={MdExpandMore}
        MdExpandLess={MdExpandLess}
      />
    </div>
  );
}
