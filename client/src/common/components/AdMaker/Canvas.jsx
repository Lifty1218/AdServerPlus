import React, { useEffect, useRef } from "react";
import { useStateContext } from "../../../context/context";
import { fabric } from "fabric";

const Canvas = () => {
  const { setCanvasObject, setSelectedObject, canvasDimensions } =
    useStateContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
    });

    const handleSelectionCleared = () => {
      console.log("Cleared");
      setSelectedObject(null);
    };

    const handleSelection = (e) => {
      const shape = e.target;
      if (shape) {
        console.log(shape);
        setSelectedObject(shape);
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);

    setCanvasObject(canvas);

    return () => {
      if (canvas) {
        canvas.off("selection:created", handleSelection);
        canvas.off("selection:updated", handleSelection);
        canvas.off("selection:cleared", handleSelectionCleared);
      }
      canvas.dispose();
    };
  }, [setSelectedObject]);

  // useEffect(() => {
  //   if (canvas) {
  //     canvas.isDrawingMode = drawingMode;
  //   }
  // }, [canvas, drawingMode]);

  return <canvas ref={canvasRef} className="canvas" />;
};

export default Canvas;
