"use client";

import { useState, useRef, useEffect } from "react";
import Header from "./components/header";

type Shape = {
  type: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  sides?: number;
};

const Home: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [sides, setSides] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [shapes, setShapes] = useState<Shape[]>([]);
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

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    const { type, startX, startY, endX, endY, sides } = shape;
    const width = endX - startX;
    const height = endY - startY;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    switch (type) {
      case "rectangle":
        ctx.fillRect(startX, startY, width, height);
        ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle":
        ctx.beginPath();
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.arc(
          startX + width / 2,
          startY + height / 2,
          radius,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case "polygon":
        if (sides && sides >= 3) {
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          const radius = Math.sqrt(width * width + height * height) / 2;
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
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (canvasRef.current && selectedShape) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setStartPos({ x, y });
      setCurrentPos({ x, y });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDrawing && canvasRef.current && startPos) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCurrentPos({ x, y });

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) => drawShape(ctx, shape));
        drawShape(ctx, {
          type: selectedShape!,
          startX: startPos.x,
          startY: startPos.y,
          endX: x,
          endY: y,
          sides: sides || undefined,
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && startPos && currentPos) {
      const newShape: Shape = {
        type: selectedShape!,
        startX: startPos.x,
        startY: startPos.y,
        endX: currentPos.x,
        endY: currentPos.y,
        sides: sides || undefined,
      };
      setShapes([...shapes, newShape]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [selectedShape, sides, isDrawing, startPos, currentPos, shapes]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) => drawShape(ctx, shape));
      }
    }
  }, [shapes]);

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
              cursor: selectedShape ? "crosshair" : "default",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
