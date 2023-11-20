import React from "react";
import { useStateContext } from "../../../context/context";
import { FiDownload } from "react-icons/fi";

const SaveExport = ({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) => {
  const { canvasObject, canvasDimensions, canvasColor } = useStateContext();

  const handleExport = (format) => {
    if (canvasObject) {
      // Store the current dimensions
      const currentWidth = canvasObject.width;
      const currentHeight = canvasObject.height;
      const currentBackgroundColor = canvasObject.backgroundColor;
      const currentZoomLevel = canvasObject.getZoom();

      // Set canvas dimensions to default dimensions
      canvasObject.setWidth(canvasDimensions.width);
      canvasObject.setHeight(canvasDimensions.height);
      canvasObject.setZoom(1);

      if (format != "png") {
        canvasObject.setBackgroundColor(
          canvasColor,
          canvasObject.renderAll.bind(canvasObject)
        );
      }
      canvasObject.renderAll();

      // Export the canvas
      const dataUrl = canvasObject.toDataURL({
        format: format,
        quality: 0.8,
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `canvas_image.${format}`;
      downloadLink.click();

      // Restore the original dimensions
      canvasObject.setWidth(currentWidth);
      canvasObject.setHeight(currentHeight);
      if (format != "png") {
        canvasObject.setBackgroundColor(
          currentBackgroundColor,
          canvasObject.renderAll.bind(canvasObject)
        );
      }
      canvasObject.setZoom(currentZoomLevel);
      canvasObject.renderAll();

      console.log("Exported:", dataUrl);
    }
  };

  return (
    <div className="save-export">
      <h2
        onClick={() => handleHeadingClick("export")}
        className="expand-heading sidebar-heading"
      >
        Export
        {expandedSections.includes("export") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("export") ? "expanded2" : ""
        }`}
      >
        <button onClick={() => handleExport("jpeg")} className="save-button">
          Export JPEG
          <span className="sidebar-button-icon2">
            <FiDownload />
          </span>
        </button>
        <button onClick={() => handleExport("png")} className="save-button">
          Export PNG
          <span className="sidebar-button-icon2">
            <FiDownload />
          </span>
        </button>
        <button onClick={() => handleExport("svg")} className="save-button">
          Export SVG
          <span className="sidebar-button-icon2">
            <FiDownload />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SaveExport;
