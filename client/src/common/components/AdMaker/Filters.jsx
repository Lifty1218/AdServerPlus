import React from "react";
import { fabric } from "fabric";
import { useStateContext } from "../../../context/context";

export default function Filters({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) {
  const { canvasObject } = useStateContext();

  const handleApplyFilter = (filterType) => {
    if (canvasObject) {
      const activeObject = canvasObject.getActiveObject();
      if (activeObject) {
        let filter;
        switch (filterType) {
          case "grayscale":
            filter = new fabric.Image.filters.Grayscale();
            break;
          case "sepia":
            filter = new fabric.Image.filters.Sepia();
            break;
          case "invert":
            filter = new fabric.Image.filters.Invert();
            break;
          case "brightness":
            filter = new fabric.Image.filters.Brightness({
              brightness: 0.5, // Adjust the value as needed
            });
            break;
          case "blur":
            filter = new fabric.Image.filters.Blur({
              blur: 1, // Adjust the value as needed
            });
            break;
          case "contrast":
            filter = new fabric.Image.filters.Contrast({
              contrast: 0.5, // Adjust the value as needed
            });
            break;
          case "hueRotation":
            filter = new fabric.Image.filters.HueRotation({
              rotation: 90, // Adjust the value as needed
            });
            break;
          case "pixelate":
            filter = new fabric.Image.filters.Pixelate({
              blocksize: 4, // Adjust the value as needed
            });
            break;
          // Add more cases for additional filters
          default:
            break;
        }
        if (filter) {
          activeObject.filters.push(filter);
          activeObject.applyFilters();
          canvasObject.renderAll();
        }
      }
    }
  };
  return (
    <>
      <h2
        onClick={() => handleHeadingClick("filters")}
        className="expand-heading sidebar-heading"
      >
        Filters & Effects
        {expandedSections.includes("filters") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("filters") ? "expanded2" : ""
        }`}
      >
        <button
          onClick={() => handleApplyFilter("grayscale")}
          className="sidebar-button"
        >
          Grayscale
        </button>
        <button
          onClick={() => handleApplyFilter("sepia")}
          className="sidebar-button"
        >
          Sepia
        </button>
        <button
          onClick={() => handleApplyFilter("invert")}
          className="sidebar-button"
        >
          Invert
        </button>
        <button
          onClick={() => handleApplyFilter("brightness")}
          className="sidebar-button"
        >
          Brightness
        </button>
        <button
          onClick={() => handleApplyFilter("blur")}
          className="sidebar-button"
        >
          Blur
        </button>
        <button
          onClick={() => handleApplyFilter("contrast")}
          className="sidebar-button"
        >
          Contrast
        </button>
        <button
          onClick={() => handleApplyFilter("hueRotation")}
          className="sidebar-button"
        >
          Hue Rotation
        </button>
        <button
          onClick={() => handleApplyFilter("pixelate")}
          className="sidebar-button"
        >
          Pixelate
        </button>
      </div>
    </>
  );
}
