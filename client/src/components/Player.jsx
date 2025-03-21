import { useEffect, useState, useRef } from "react";

const Player = ({ position, gamePaused, onShoot, direction, setDirection }) => {
  const [aimDirection, setAimDirection] = useState({ x: 0, y: -1 });
  const playerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gamePaused) return;

      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") setDirection("up");
      else if (key === "arrowdown" || key === "s") setDirection("down");
      else if (key === "arrowleft" || key === "a") setDirection("left");
      else if (key === "arrowright" || key === "d") setDirection("right");
    };

    const handleMouseMove = (e) => {
      if (gamePaused || !playerRef.current) return;

      const rect = playerRef.current.getBoundingClientRect();
      const playerCenterX = rect.left + rect.width / 2;
      const playerCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - playerCenterX;
      const dy = e.clientY - playerCenterY;

      const length = Math.sqrt(dx * dx + dy * dy);
      if (length > 0) {
        setAimDirection({
          x: dx / length,
          y: dy / length,
        });

        if (Math.abs(dx) > Math.abs(dy)) {
          setDirection(dx > 0 ? "right" : "left");
        } else {
          setDirection(dy > 0 ? "down" : "up");
        }
      }
    };

    const handleMouseDown = (e) => {
      if (gamePaused || e.button !== 0) return;
      onShoot(position, aimDirection);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gamePaused, onShoot, position, direction, setDirection, aimDirection]);

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

  const angle = Math.atan2(aimDirection.y, aimDirection.x) * (180 / Math.PI);

  return (
    <div
      ref={playerRef}
      className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-crosshair"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        transition: gamePaused ? "none" : "top 0.1s, left 0.1s",
      }}
    >
      <div className="text-xl">{getDirectionEmoji()}</div>

      <div
        className="absolute w-12 h-0.5 bg-red-500 origin-left"
        style={{
          transform: `rotate(${angle}deg)`,
          opacity: 0.7,
        }}
      />
    </div>
  );
};

export default Player;
