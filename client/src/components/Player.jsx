import React, { useState, useEffect } from "react";

export const Player = ({ containerRef }) => {
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const speed = 0.5;

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();

      setPosition((prev) => {
        let { x, y } = prev;

        if ((e.key === "ArrowUp" || e.key === "w") && y > 5) {
          y -= speed;
        }
        if ((e.key === "ArrowDown" || e.key === "s") && y < 90) {
          y += speed;
        }
        if ((e.key === "ArrowLeft" || e.key === "a") && x > 5) {
          x -= speed;
        }
        if ((e.key === "ArrowRight" || e.key === "d") && x < 95) {
          x += speed;
        }

        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        transition: "left 0.1s, top 0.1s",
      }}
    >
      Player
    </div>
  );
};
