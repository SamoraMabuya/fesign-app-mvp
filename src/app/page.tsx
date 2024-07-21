"use client";
// pages/index.tsx
import { useState } from "react";
import Header from "./components/header";

const Home: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleCanvasSelect = (width: number, height: number) => {
    setCanvasSize({ width, height });
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onCanvasSelect={handleCanvasSelect} />
      <div className="flex-grow flex justify-center items-center">
        {canvasSize && (
          <div
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              border: "2px solid #ccc",
              backgroundColor: "#fff",
            }}
          >
            Canvas: {canvasSize.width} x {canvasSize.height}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
