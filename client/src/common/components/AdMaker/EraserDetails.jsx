import React, { useState } from "react";
import { useStateContext } from "../../../context/context";

export default function EraserDetails({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) {
  const { canvasObject } = useStateContext();

  const [width, setWidth] = useState(20);

  const handleWidthChange = (e) => {
    const newValue = parseInt(e.target.value);
    setWidth(newValue);
    canvasObject.freeDrawingBrush.width = newValue;
  };

  return (
    <div>
      <h2
        onClick={() => handleHeadingClick("eraser")}
        className="expand-heading sidebar-heading"
      >
        Eraser Details
        {expandedSections.includes("eraser") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("eraser") ? "expanded2" : ""
        }`}
      >
        <h2 className="sidebar-heading-sub">Width</h2>
        <div className="shape-details-inner-container">
          <label className="shape-details-label" htmlFor="width">
            Eraser:
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
