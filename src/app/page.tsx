"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./components/header";

type Shape = {
  id: string;
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
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasSelect = (width: number, height: number) => {
    setCanvasSize({ width, height });
  };

  const handleShapeSelect = (shape: string, sides?: number) => {
    setSelectedShape(shape);
    setIsSelectMode(false);
    setSelectedShapeId(null); // Add this line
    if (shape === "polygon" && sides) {
      setSides(sides);
    } else {
      setSides(null);
    }
  };

  const handleSelectModeToggle = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedShapeId(null);
  };

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    isSelected: boolean = false
  ) => {
    const { type, startX, startY, endX, endY, sides } = shape;
    const width = endX - startX;
    const height = endY - startY;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.strokeStyle = isSelected ? "blue" : "black";
    ctx.lineWidth = isSelected ? 2 : 1;

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

  const cursorStyle = () => {
    switch (true) {
      case isSelectMode:
        return "default";
      case selectedShape !== null:
        return "crosshair";
      default:
        return "default";
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (canvasRef.current && selectedShape && !isSelectMode) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setStartPos({ x, y });
      setCurrentPos({ x, y });
      setIsDrawing(true);
    } else if (isSelectMode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const shape = shapes.find(
        (shape) =>
          x >= shape.startX &&
          x <= shape.endX &&
          y >= shape.startY &&
          y <= shape.endY
      );
      if (shape) {
        if (event.shiftKey) {
          setSelectedShapeIds((prevIds) => [...prevIds, shape.id]);
        } else {
          setSelectedShapeIds([shape.id]);
        }
        setDragOffset({ x: x - shape.startX, y: y - shape.startY });
      } else {
        setSelectedShapeIds([]);
        setDragOffset(null);
        setStartPos({ x, y });
        setCurrentPos({ x, y });
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDrawing && canvasRef.current && startPos) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCurrentPos({ x, y });

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) =>
          drawShape(ctx, shape, selectedShapeIds.includes(shape.id))
        );
        drawShape(ctx, {
          id: "",
          type: selectedShape!,
          startX: startPos.x,
          startY: startPos.y,
          endX: x,
          endY: y,
          sides: sides || undefined,
        });
      }
    } else if (
      isSelectMode &&
      selectedShapeIds.length &&
      dragOffset &&
      event.buttons === 1
    ) {
      // Check if left mouse button is pressed
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newShapes = shapes.map((shape) =>
        selectedShapeIds.includes(shape.id)
          ? {
              ...shape,
              startX: x - dragOffset.x,
              startY: y - dragOffset.y,
              endX: x - dragOffset.x + (shape.endX - shape.startX),
              endY: y - dragOffset.y + (shape.endY - shape.startY),
            }
          : shape
      );
      setShapes(newShapes);

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        newShapes.forEach((shape) =>
          drawShape(ctx, shape, selectedShapeIds.includes(shape.id))
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && startPos && currentPos) {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: selectedShape!,
        startX: startPos.x,
        startY: startPos.y,
        endX: currentPos.x,
        endY: currentPos.y,
        sides: sides || undefined,
      };
      setShapes([...shapes, newShape]);
    } else if (isSelectMode && startPos && currentPos) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x1 = Math.min(startPos.x, currentPos.x);
      const y1 = Math.min(startPos.y, currentPos.y);
      const x2 = Math.max(startPos.x, currentPos.x);
      const y2 = Math.max(startPos.y, currentPos.y);

      const selectedIds = shapes
        .filter(
          (shape) =>
            shape.startX >= x1 &&
            shape.endX <= x2 &&
            shape.startY >= y1 &&
            shape.endY <= y2
        )
        .map((shape) => shape.id);

      setSelectedShapeIds(selectedIds);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Delete" && selectedShapeId) {
      setShapes(shapes.filter((shape) => shape.id !== selectedShapeId));
      setSelectedShapeId(null);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    selectedShape,
    sides,
    isDrawing,
    startPos,
    currentPos,
    shapes,
    selectedShapeId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
  ]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) =>
          drawShape(ctx, shape, shape.id === selectedShapeId)
        );
      }
    }
  }, [shapes, selectedShapeId]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        onCanvasSelect={handleCanvasSelect}
        onShapeSelect={handleShapeSelect}
        onSelectModeToggle={handleSelectModeToggle}
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
              cursor: cursorStyle(),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
