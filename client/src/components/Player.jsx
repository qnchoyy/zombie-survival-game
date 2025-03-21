import { useEffect, useState } from "react";

const Player = ({ position, gamePaused }) => {
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gamePaused) return;

      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") setDirection("up");
      else if (key === "arrowdown" || key === "s") setDirection("down");
      else if (key === "arrowleft" || key === "a") setDirection("left");
      else if (key === "arrowright" || key === "d") setDirection("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gamePaused]);

  const getDirectionEmoji = () => {
    switch (direction) {
      case "up":
        return "👆";
      case "down":
        return "👇";
      case "left":
        return "👈";
      case "right":
        return "👉";
      default:
        return "👤";
    }
  };

  return (
    <div
      className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        transition: gamePaused ? "none" : "top 0.1s, left 0.1s",
      }}
    >
      <div className="text-xl">{getDirectionEmoji()}</div>
    </div>
  );
};

export default Player;
