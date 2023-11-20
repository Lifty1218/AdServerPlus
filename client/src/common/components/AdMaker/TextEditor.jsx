import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { useStateContext } from "../../../context/context";

const TextEditor = ({
  handleHeadingClick,
  expandedSections,
  MdExpandMore,
  MdExpandLess,
}) => {
  const { canvasObject } = useStateContext();
  const [text, setText] = useState("");
  const [fontSizeValue, setFontSizeValue] = useState(32);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (canvasObject) {
      canvasObject.on("selection:created", handleSelection);
      canvasObject.on("selection:updated", handleSelection);
      canvasObject.on("selection:cleared", handleSelectionCleared);
    }
    return () => {
      if (canvasObject) {
        canvasObject.off("selection:created", handleSelection);
        canvasObject.off("selection:updated", handleSelection);
        canvasObject.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [canvasObject]);

  const handleSelection = () => {
    const activeObject = canvasObject.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      setText(activeObject.text);
      setFontSizeValue(activeObject.fontSize);
      setColor(activeObject.fill);
    } else {
      setText("");
      setFontSizeValue(32);
      setColor("#000000");
    }
  };

  const handleSelectionCleared = () => {
    setText("");
    setFontSizeValue(32);
    setColor("#000000");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    const activeObject = canvasObject.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("text", e.target.value);
      canvasObject.requestRenderAll();
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSizeValue(newSize);
    const activeObject = canvasObject.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fontSize", newSize);
      canvasObject.requestRenderAll();
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    const activeObject = canvasObject.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", newColor);
      canvasObject.requestRenderAll();
    }
  };

  const handleAddText = () => {
    const newText = new fabric.Textbox(text, {
      left: 10,
      top: 10,
      fill: color,
      fontSize: fontSizeValue,
    });
    canvasObject.add(newText);
    canvasObject.setActiveObject(newText);
    canvasObject.renderAll();
  };

  return (
    <div className="text-editor-container">
      <h2
        onClick={() => handleHeadingClick("text")}
        className="expand-heading sidebar-heading"
      >
        Text Editor
        {expandedSections.includes("text") ? (
          <MdExpandLess className="heading-icon" />
        ) : (
          <MdExpandMore className="heading-icon" />
        )}
      </h2>
      <div
        className={`expanded-container ${
          expandedSections.includes("text") ? "expanded2" : ""
        }`}
      >
        <div className="text-editor-inner-container">
          <label htmlFor="text" className="text-editor-label">
            Text:
          </label>
          <input
            type="text"
            id="text"
            className="text-editor-input"
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div className="text-editor-inner-container">
          <label htmlFor="font-size" className="text-editor-label">
            Font Size:
          </label>
          <input
            type="number"
            id="font-size"
            className="text-editor-input"
            value={fontSizeValue}
            onChange={handleFontSizeChange}
          />
        </div>
        <div className="text-editor-inner-container text-color-input-container">
          <label className="text-editor-label">Text Color:</label>
          <input
            type="color"
            className="text-editor-input color-input"
            value={color}
            onChange={handleColorChange}
          />
        </div>
        <button className="add-text-button" onClick={handleAddText}>
          Add Text
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
