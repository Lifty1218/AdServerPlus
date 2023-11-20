import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/context";

const ColorPicker = ({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) => {
  const { selectedTool, selectedObject, canvasObject } = useStateContext();
  const [fill, setFill] = useState("#ffffff");
  const [stroke, setStroke] = useState("#ffffff");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (canvasObject) {
      if (selectedObject) {
        console.log(selectedObject);
        setFill(selectedObject.fill);
        setStroke(selectedObject.stroke);
        setWidth(selectedObject.scaleX * selectedObject.width);
        setHeight(selectedObject.scaleY * selectedObject.height);
        canvasObject.freeDrawingBrush = null;
      } else {
        setFill("#ffffff");
        setStroke("#ffffff");
        setWidth(0);
        setHeight(0);
      }
    }
  }, [canvasObject, selectedObject]);

  const handleFillChange = (e) => {
    const newColor = e.target.value;
    setFill(newColor);

    if (selectedObject) {
      selectedObject.set("fill", newColor);
      canvasObject.renderAll();
    }
    // if (selectedTool === "pencil" && canvasObject) {
    //   canvasObject.freeDrawingBrush.color = newColor;
    // }
    // if (selectedTool === "text" && canvasObject) {
    //   canvasObject.getObjects().forEach((obj) => {
    //     if (obj.type === "text") {
    //       obj.set("fill", newColor);
    //     }
    //   });
    //   canvasObject.renderAll();
    // }
  };

  const handleTransparentClick = (e) => {
    const attributeName = e.target.name;
    if (selectedObject) {
      selectedObject.set(attributeName, "transparent");
      canvasObject.renderAll();
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    const attributeName = e.target.name;
    console.log(attributeName);
    console.log(newValue);
    switch (attributeName) {
      case "fill":
        setFill(newValue);
        break;
      case "stroke":
        setStroke(newValue);
        break;
      case "scaleX":
        setWidth(newValue);
        break;
      case "scaleY":
        setHeight(newValue);
        break;
      default:
        break;
    }
    if (selectedObject) {
      selectedObject.set(
        attributeName,
        attributeName === "scaleX"
          ? newValue / selectedObject.width
          : attributeName === "scaleY"
          ? newValue / selectedObject.height
          : newValue
      );
      canvasObject.renderAll();
    }
  };

  return (
    <div>
      <h2
        onClick={() => handleHeadingClick("shape-details")}
        className="expand-heading sidebar-heading"
      >
        Shape Details
        {expandedSections.includes("shape-details") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("shape-details") ? "expanded2" : ""
        }`}
      >
        <h2 className="sidebar-heading-sub">Colors</h2>
        <div className="shape-details-container">
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="fill">
              Fill:
            </label>
            <input
              type="color"
              id="fill"
              name="fill"
              className="shape-details-input color-input"
              value={fill}
              onChange={handleChange}
            />
          </div>
          <div className="shape-details-inner-container">
            <div className="shape-details-label"></div>
            <button
              name="fill"
              className="shape-details-input transparent-button"
              onClick={handleTransparentClick}
            >
              Transparent
            </button>
          </div>

          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="stroke">
              Stroke:
            </label>
            <input
              type="color"
              id="stroke"
              name="stroke"
              className="shape-details-input color-input"
              value={stroke}
              onChange={handleChange}
            />
          </div>
          <div className="shape-details-inner-container">
            <div className="shape-details-label"></div>
            <button
              name="stroke"
              className="shape-details-input transparent-button"
              onClick={handleTransparentClick}
            >
              Transparent
            </button>
          </div>
        </div>

        <h2 className="sidebar-heading-sub" style={{ marginTop: "1.2rem" }}>
          Dimensions
        </h2>
        <div className="shape-details-container">
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="width">
              Width:
            </label>
            <input
              type="number"
              id="width"
              name="scaleX"
              className="shape-details-input"
              value={width}
              onChange={handleChange}
            />
          </div>
          <div className="shape-details-inner-container">
            <label className="shape-details-label" htmlFor="height">
              Heigth:
            </label>
            <input
              type="number"
              id="height"
              name="scaleY"
              className="shape-details-input"
              value={height}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
