import { useState, createContext, useContext } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [screenSize, setScreenSize] = useState(undefined);
  const [profileClicked, setProfileClicked] = useState(false);
  // ! SHOULD CHANGE LATER TO IMPROVE SECURITY
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [canvasObject, setCanvasObject] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [canvasColor, setCanvasColor] = useState("#ffffff");

  const clearCanvas = () => {
    if (canvasObject) {
      canvasObject.clear();
    }
    setCanvasObject(null);
    setSelectedObject(null);
    setSelectedTool(null);
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        profileClicked,
        setProfileClicked,
        currentAdvertiser,
        setCurrentAdvertiser,
        currentPublisher,
        setCurrentPublisher,
        currentAdmin,
        setCurrentAdmin,
        canvasObject,
        setCanvasObject,
        selectedTool,
        setSelectedTool,
        selectedObject,
        setSelectedObject,
        clearCanvas,
        canvasDimensions,
        setCanvasDimensions,
        canvasColor,
        setCanvasColor,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
