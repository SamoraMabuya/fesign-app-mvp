"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./components/header";

const Home = () => {
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [sides, setSides] = useState<number | null>(null); // Add sides state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasSelect = (width: number, height: number) => {
    setCanvasSize({ width, height });
  };

  const handleShapeSelect = (shape: string, sides?: number) => {
    setSelectedShape(shape);
    if (shape === "polygon" && sides) {
      setSides(sides);
    } else {
      setSides(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx && selectedShape) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        switch (selectedShape) {
          case "rectangle":
            ctx.fillRect(50, 50, 150, 100);
            ctx.strokeRect(50, 50, 150, 100);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(125, 125, 50, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(200, 200);
            ctx.stroke();
            break;
          case "polygon":
            if (sides && sides >= 3) {
              const centerX = 125;
              const centerY = 125;
              const radius = 50;
              ctx.beginPath();
              for (let i = 0; i < sides; i++) {
                const angle = (i * 2 * Math.PI) / sides;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            break;
          default:
            break;
        }
      }
    }
  }, [selectedShape, sides]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        onCanvasSelect={handleCanvasSelect}
        onShapeSelect={handleShapeSelect}
      />
      <div className="flex-grow flex justify-center items-center">
        {canvasSize && (
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              border: "2px solid #ccc",
              backgroundColor: "#fff",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
