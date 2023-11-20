import React, { useState } from "react";
import { useStateContext } from "../../../context/context";


export default function PencilDetails({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) {
  const { canvasObject } = useStateContext();

  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(2);

  const handleColorChange = (e) => {
    setColor(e.target.value);
    canvasObject.freeDrawingBrush.color = e.target.value;
  };

  const handleWidthChange = (e) => {
    const newValue = parseInt(e.target.value);
    setWidth(newValue);
    canvasObject.freeDrawingBrush.width = newValue;
  };

  return (
    <div>
      <h2
        onClick={() => handleHeadingClick("pencil")}
        className="expand-heading sidebar-heading"
      >
        Pencil Details
        {expandedSections.includes("pencil") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("pencil") ? "expanded2" : ""
        }`}
      >
        <h2 className="sidebar-heading-sub">Color</h2>
        <div className="shape-details-inner-container">
          <label className="shape-details-label" htmlFor="color">
            Pencil:
          </label>
          <input
            type="color"
            id="color"
            className="shape-details-input color-input"
            value={color}
            onChange={handleColorChange}
          />
        </div>

        <h2 className="sidebar-heading-sub" style={{ marginTop: "1.2rem" }}>
          Width
        </h2>
        <div className="shape-details-inner-container">
          <label className="shape-details-label" htmlFor="width">
            Pencil:
          </label>
          <input
            type="number"
            id="width"
            className="shape-details-input"
            value={width}
            onChange={handleWidthChange}
          />
        </div>
      </div>
    </div>
  );
}
