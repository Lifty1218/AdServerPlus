import React, { useState } from "react";
import { useStateContext } from "../../../context/context";
import { ImArrowUp2, ImArrowDown2 } from "react-icons/im";

const LayerPanel = () => {
  const { canvasObject, selectedObject, setSelectedObject } = useStateContext();
  const [layerUpdate, setLayerUpdate] = useState(false);

  const handleMoveUp = () => {
    if (canvasObject && selectedObject) {
      canvasObject.bringForward(selectedObject);
      canvasObject.renderAll();
      setLayerUpdate(!layerUpdate);
    }
  };

  const handleMoveDown = () => {
    if (canvasObject && selectedObject) {
      canvasObject.sendBackwards(selectedObject);
      canvasObject.renderAll();
      setLayerUpdate(!layerUpdate);
    }
  };

  const handleLayerItemClick = (object) => {
    setSelectedObject(object);
    canvasObject.discardActiveObject();
    canvasObject.setActiveObject(object);
    canvasObject.renderAll();
  };

  const renderLayers = () => {
    if (!canvasObject) {
      return null;
    }

    const objects = canvasObject.getObjects();

    return objects.map((object, index) => (
      <div
        key={index}
        className={`layer-item ${object === selectedObject ? "selected" : ""}`}
        onClick={() => handleLayerItemClick(object)}
      >
        <span className="layer-index">{index + 1}</span>
        <span className="layer-name">{object.type}</span>
      </div>
    ));
  };

  return (
    <div className="layer-panel">
      <h2
        className="sidebar-heading"
        style={{ fontSize: "2.6rem", marginTop: ".5rem", marginBottom: ".5rem" }}
      >
        Layer Panel
      </h2>
      <div className="layer-container">{renderLayers()}</div>
      <div className="layer-actions">
        <button onClick={handleMoveUp} className="layer-action-button">
          Move Up
          <span style={{ marginLeft: ".4rem" }}>
            <ImArrowUp2 />
          </span>
        </button>
        <button onClick={handleMoveDown} className="layer-action-button">
          Move Down
          <span style={{ marginLeft: ".4rem" }}>
            <ImArrowDown2 />
          </span>
        </button>
      </div>
    </div>
  );
};

export default LayerPanel;
