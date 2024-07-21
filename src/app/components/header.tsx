import { useState } from "react";
import { CanvasIcon, FileIcon, ShapesIcon, TextIcon } from "./icons";

type HeaderProps = {
  onCanvasSelect: (width: number, height: number) => void;
  onShapeSelect: (shape: string, sides?: number) => void;
};

const Header = ({ onCanvasSelect, onShapeSelect }: HeaderProps) => {
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [shapeDropdownOpen, setShapeDropdownOpen] = useState(false);
  const [polygonDropdownOpen, setPolygonDropdownOpen] = useState(false);
  const [canvasDropdownOpen, setCanvasDropdownOpen] = useState(false);

  const canvasOptions = [
    { width: 1920, height: 1080, label: "1920 x 1080 (Full HD)" },
    { width: 1366, height: 768, label: "1366 x 768 (HD)" },
    { width: 1280, height: 720, label: "1280 x 720 (HD)" },
    { width: 1024, height: 768, label: "1024 x 768 (XGA)" },
    { width: 800, height: 600, label: "800 x 600 (SVGA)" },
    { width: 1440, height: 900, label: "1440 x 900 (WXGA+)" },
    { width: 2560, height: 1440, label: "2560 x 1440 (QHD)" },
    { width: 3840, height: 2160, label: "3840 x 2160 (4K UHD)" },
    { width: 1080, height: 1920, label: "1080 x 1920 (Vertical HD)" },
    { width: 768, height: 1024, label: "768 x 1024 (Vertical XGA)" },
    { width: 414, height: 736, label: "414 x 736 (iPhone 8 Plus)" },
    { width: 375, height: 667, label: "375 x 667 (iPhone 8)" },
    { width: 360, height: 640, label: "360 x 640 (Android Small)" },
    { width: 360, height: 800, label: "360 x 800 (Android Large)" },
    { width: 1440, height: 960, label: "1440 x 960 (Surface Pro 8)" },
    { width: 744, height: 1133, label: "744 x 1133 (iPad mini 8.3)" },
    { width: 834, height: 1194, label: "834 x 1194 (iPad Pro 11)" },
    { width: 1024, height: 1366, label: "1024 x 1366 (iPad Pro 12.9)" },
    { width: 1280, height: 832, label: "1280 x 832 (MacBook Air)" },
    { width: 1512, height: 982, label: "1512 x 982 (MacBook Pro 14)" },
    { width: 1728, height: 1117, label: "1728 x 1117 (MacBook Pro 16)" },
    { width: 1440, height: 1024, label: "1440 x 1024 (Desktop)" },
    { width: 1440, height: 1024, label: "1440 x 1024 (Wireframe)" },
  ];

  return (
    <header className="bg-transparent border-b border-gray-300 p-4 flex items-center">
      <div className="relative">
        <button
          onClick={() => setFileDropdownOpen(!fileDropdownOpen)}
          className="px-4 py-2 flex gap-2"
        >
          <FileIcon />
          File
        </button>
        {fileDropdownOpen && (
          <div className="absolute mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
            <ul className="absolute mt-1 w-64 bg-neutral-700 rounded shadow-lg max-h-[50vh] overflow-y-auto">
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Item 1
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setShapeDropdownOpen(!shapeDropdownOpen)}
          className="px-4 py-2 flex gap-2"
        >
          <ShapesIcon />
          Shape
        </button>
        {shapeDropdownOpen && (
          <div className="absolute mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
            <ul className="absolute mt-1 w-64 bg-neutral-700 rounded shadow-lg max-h-[50vh] overflow-y-auto">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onShapeSelect("rectangle");
                  setShapeDropdownOpen(false);
                }}
              >
                Rectangle
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onShapeSelect("circle");
                  setShapeDropdownOpen(false);
                }}
              >
                Circle
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onShapeSelect("line");
                  setShapeDropdownOpen(false);
                }}
              >
                Line
              </li>
              <li className="relative">
                <button
                  className="px-4 py-2 w-full text-left hover:bg-gray-200 cursor-pointer"
                  onClick={() => setPolygonDropdownOpen(!polygonDropdownOpen)}
                >
                  Polygon
                </button>
                {polygonDropdownOpen && (
                  <div className="absolute mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
                    <ul className="absolute mt-1 w-64 bg-neutral-700 rounded shadow-lg max-h-[50vh] overflow-y-auto">
                      {[...Array(8)].map((_, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            onShapeSelect("polygon", index + 3);
                            setPolygonDropdownOpen(false);
                            setShapeDropdownOpen(false);
                          }}
                        >
                          {index + 3} Sides
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="px-4 py-2 flex gap-2">
        <TextIcon />
        Text
      </div>
      <div className="relative">
        <button
          onClick={() => setCanvasDropdownOpen(!canvasDropdownOpen)}
          className="px-4 py-2 flex gap-2"
        >
          <CanvasIcon />
          Canvas
        </button>
        {canvasDropdownOpen && (
          <ul className="absolute mt-1 w-64 bg-neutral-700 rounded shadow-lg max-h-[50vh] overflow-y-auto">
            {canvasOptions.map((option, index) => (
              <li
                key={index}
                className="relative px-8 py-2 text-neutral-50 hover:bg-neutral-500 cursor-pointer font-semibold"
                onClick={() => {
                  onCanvasSelect(option.width, option.height);
                  setCanvasDropdownOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
