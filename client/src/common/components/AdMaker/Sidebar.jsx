import React, { useState } from "react";
import FileUploader from "./FileUploader";
import LayerPanel from "./LayerPanel";
import { fabric } from "fabric";
import { useStateContext } from "../../../context/context";
import {
  MdOutlineRectangle,
  MdOutlineCircle,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbOvalVertical } from "react-icons/tb";
// import { AiOutlineLine, AiOutlineClear } from "react-icons/ai";
import {
  BsPencil,
  BsEraser,
  BsZoomIn,
  BsZoomOut,
  BsCursor,
} from "react-icons/bs";

const Sidebar = ({ topBarHeight }) => {
  const {
    canvasObject,
    selectedTool,
    setSelectedTool,
    setSelectedObject,
    canvasColor,
  } = useStateContext();
  const [expandedSections, setExpandedSections] = useState(["images", "zoom"]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const upperHeight = `calc(65vh - ${topBarHeight}px/2)`;
  const lowerHeight = `calc(35vh - ${topBarHeight}px/2)`;

  const handleToolSelection = (tool) => {
    setSelectedTool(tool);
    if (tool === "pencil") {
      canvasObject.isDrawingMode = true;
      canvasObject.freeDrawingBrush = new fabric.PencilBrush(canvasObject);
      canvasObject.freeDrawingBrush.color = "#000000";
      canvasObject.freeDrawingBrush.width = 2;
      canvasObject.on("selection:created", handleSelection);
      canvasObject.on("selection:updated", handleSelection);
    } else if (tool === "eraser") {
      canvasObject.isDrawingMode = true;
      canvasObject.freeDrawingBrush = new fabric.PencilBrush(canvasObject);
      canvasObject.freeDrawingBrush.color = canvasColor;
      canvasObject.freeDrawingBrush.width = 20;
      canvasObject.on("selection:created", handleSelection);
      canvasObject.on("selection:updated", handleSelection);
    } else {
      canvasObject.isDrawingMode = false;
      canvasObject.off("selection:created", handleSelection);
      canvasObject.off("selection:updated", handleSelection);
    }
  };

  const handleSelection = (event) => {
    const selectedObject = event.target;
    if (selectedObject.type === "path") {
      // Deselect the eraser lines
      canvasObject.discardActiveObject();
      canvasObject.renderAll();
    }
  };

  const handleShapeSelection = (shape) => {
    setSelectedTool(null);
    if (canvasObject) {
      if (shape === "Rect") {
        canvasObject.isDrawingMode = false;
        canvasObject.off("path:created");
        const rect = new fabric.Rect({
          width: 100,
          height: 100,
          fill: "transparent",
          stroke: "#000000",
          strokeWidth: 2,
        });
        canvasObject.add(rect);
        canvasObject.setActiveObject(rect);
        canvasObject.renderAll();
      } else if (shape === "Circle") {
        canvasObject.isDrawingMode = false;
        canvasObject.off("path:created");
        const circle = new fabric.Circle({
          radius: 50,
          fill: "transparent",
          stroke: "#000000",
          strokeWidth: 2,
        });
        canvasObject.add(circle);
        canvasObject.setActiveObject(circle);
        canvasObject.renderAll();
      } else if (shape === "Triangle") {
        canvasObject.isDrawingMode = false;
        canvasObject.off("path:created");
        const triangle = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "transparent",
          stroke: "#000000",
          strokeWidth: 2,
        });
        canvasObject.add(triangle);
        canvasObject.setActiveObject(triangle);
        canvasObject.renderAll();
      } else if (shape === "Ellipse") {
        canvasObject.isDrawingMode = false;
        canvasObject.off("path:created");
        const ellipse = new fabric.Ellipse({
          rx: 50,
          ry: 25,
          fill: "transparent",
          stroke: "#000000",
          strokeWidth: 2,
        });
        canvasObject.add(ellipse);
        canvasObject.setActiveObject(ellipse);
        canvasObject.renderAll();
      }
    }
  };

  const handleZoomIn = () => {
    if (canvasObject) {
      const newZoomLevel = zoomLevel + 0.1;
      const canvasWidth = canvasObject.getWidth() / zoomLevel;
      const canvasHeight = canvasObject.getHeight() / zoomLevel;

      canvasObject.setZoom(newZoomLevel);
      canvasObject.setWidth(canvasWidth * newZoomLevel);
      canvasObject.setHeight(canvasHeight * newZoomLevel);
      canvasObject.renderAll();
      setZoomLevel(newZoomLevel);
    }
  };

  const handleZoomOut = () => {
    if (canvasObject) {
      const newZoomLevel = zoomLevel - 0.1;
      if (newZoomLevel > 0) {
        const canvasWidth = canvasObject.getWidth() / zoomLevel;
        const canvasHeight = canvasObject.getHeight() / zoomLevel;

        canvasObject.setZoom(newZoomLevel);
        canvasObject.setWidth(canvasWidth * newZoomLevel);
        canvasObject.setHeight(canvasHeight * newZoomLevel);
        canvasObject.renderAll();
        setZoomLevel(newZoomLevel);
      }
    }
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      const file = files[0];
      fabric.Image.fromURL(URL.createObjectURL(file), (img) => {
        img.scaleToWidth(200);
        canvasObject.add(img);
        canvasObject.renderAll();
      });
    }
  };

  const handleRemoveItem = () => {
    if (canvasObject) {
      const activeObject = canvasObject.getActiveObject();
      if (activeObject) {
        canvasObject.remove(activeObject);
        canvasObject.discardActiveObject();
        canvasObject.renderAll();
      }
    }
  };

  const handleSelect = () => {
    if (canvasObject) {
      canvasObject.discardActiveObject();
      canvasObject.isDrawingMode = false;
      setSelectedObject(null);
      setSelectedTool(null);
      canvasObject.renderAll();
    }
  };

  const handleHeadingClick = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((sec) => sec !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-upper" style={{ flexBasis: upperHeight }}>
        <h2
          onClick={() => handleHeadingClick("shape-tools")}
          className="expand-heading sidebar-heading"
        >
          Shapes
          {expandedSections.includes("shape-tools") ? (
            <MdExpandLess className="heading-icon" />
          ) : (
            <MdExpandMore className="heading-icon" />
          )}
        </h2>
        <div
          className={`shape-container expanded-container ${
            expandedSections.includes("shape-tools") ? "expanded" : ""
          }`}
        >
          <button
            onClick={() => handleShapeSelection("Rect")}
            className="shape-button"
          >
            <span className="sidebar-button-icon">
              <MdOutlineRectangle />
            </span>
            Rect
          </button>
          <button
            onClick={() => handleShapeSelection("Circle")}
            className="shape-button"
          >
            <span className="sidebar-button-icon">
              <MdOutlineCircle />
            </span>
            Circle
          </button>
          <button
            onClick={() => handleShapeSelection("Ellipse")}
            className="shape-button"
          >
            <span className="sidebar-button-icon">
              <TbOvalVertical />
            </span>
            Ellipse
          </button>
          <button
            onClick={() => handleShapeSelection("Triangle")}
            className="shape-button"
          >
            <span className="sidebar-button-icon">
              <IoTriangleOutline />
            </span>
            Triangle
          </button>
        </div>

        <h2
          onClick={() => handleHeadingClick("tools")}
          className="expand-heading sidebar-heading"
        >
          Tools
          {expandedSections.includes("tools") ? (
            <MdExpandLess className="heading-icon" />
          ) : (
            <MdExpandMore className="heading-icon" />
          )}
        </h2>
        <div
          className={`tool-container expanded-container ${
            expandedSections.includes("tools") ? "expanded" : ""
          }`}
        >
          <button
            className={
              selectedTool === "pencil" ? "active tool-button" : "tool-button"
            }
            onClick={() => handleToolSelection("pencil")}
          >
            <span className="sidebar-button-icon">
              <BsPencil />
            </span>
            Pencil
          </button>

          <button
            className={
              selectedTool === "eraser" ? "active tool-button" : "tool-button"
            }
            onClick={() => handleToolSelection("eraser")}
          >
            <span className="sidebar-button-icon">
              <BsEraser />
            </span>
            Eraser
          </button>

          <button onClick={handleRemoveItem} className="tool-button">
            <span className="sidebar-button-icon">
              <RiDeleteBin6Line />
            </span>
            Remove
          </button>

          <button onClick={handleSelect} className="tool-button">
            <span className="sidebar-button-icon">
              <BsCursor />
            </span>
            Select
          </button>
        </div>

        <h2
          onClick={() => handleHeadingClick("images")}
          className="expand-heading sidebar-heading"
        >
          Insert Images
          {expandedSections.includes("images") ? (
            <MdExpandLess className="heading-icon" />
          ) : (
            <MdExpandMore className="heading-icon" />
          )}
        </h2>
        <div
          className={`tool-container expanded-container ${
            expandedSections.includes("images") ? "expanded" : ""
          }`}
        >
          <FileUploader onFileUpload={handleFileUpload} />
        </div>

        <h2
          onClick={() => handleHeadingClick("zoom")}
          className="expand-heading sidebar-heading"
        >
          Zoom In/Out
          {expandedSections.includes("zoom") ? (
            <MdExpandLess className="heading-icon" />
          ) : (
            <MdExpandMore className="heading-icon" />
          )}
        </h2>
        <div
          className={`zoom-container expanded-container ${
            expandedSections.includes("zoom") ? "expanded" : ""
          }`}
        >
          <button onClick={handleZoomIn} className="zoom-button">
            <BsZoomIn />
          </button>
          <button onClick={handleZoomOut} className="zoom-button">
            <BsZoomOut />
          </button>
        </div>
      </div>

      <div className="sidebar-lower" style={{ flexBasis: lowerHeight }}>
        <LayerPanel />
      </div>
    </div>
  );
};

export default Sidebar;
