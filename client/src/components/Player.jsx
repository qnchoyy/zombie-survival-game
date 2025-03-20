import { useState, useEffect, useRef } from "react";

export const Player = ({ setPlayerPosition, bridgeBounds, gamePaused }) => {
  const [position, setPosition] = useState({ x: 50, y: 90 });
  const [playerDirection, setPlayerDirection] = useState("up");
  const baseSpeed = 0.3;
  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (bridgeBounds) {
      const centerX = 50;
      const bottomY = 90;
      setPosition({ x: centerX, y: bottomY });

      setTimeout(() => {
        const absoluteX =
          bridgeBounds.left + (centerX / 100) * bridgeBounds.width;
        const absoluteY =
          bridgeBounds.top + (bottomY / 100) * bridgeBounds.height;
        setPlayerPosition({ x: absoluteX, y: absoluteY });
      }, 0);
    }
  }, [bridgeBounds, setPlayerPosition]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gamePaused) return;

      const key = e.key.toLowerCase();

      if (key === "arrowup" || key === "w") {
        keysRef.current.up = true;
        setPlayerDirection("up");
      }
      if (key === "arrowdown" || key === "s") {
        keysRef.current.down = true;
        setPlayerDirection("down");
      }
      if (key === "arrowleft" || key === "a") {
        keysRef.current.left = true;
        setPlayerDirection("left");
      }
      if (key === "arrowright" || key === "d") {
        keysRef.current.right = true;
        setPlayerDirection("right");
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();

      if (key === "arrowup" || key === "w") {
        keysRef.current.up = false;
      }
      if (key === "arrowdown" || key === "s") {
        keysRef.current.down = false;
      }
      if (key === "arrowleft" || key === "a") {
        keysRef.current.left = false;
      }
      if (key === "arrowright" || key === "d") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePaused]);

  useEffect(() => {
    if (gamePaused || !bridgeBounds) return;

    const movePlayer = () => {
      const keys = keysRef.current;
      setPosition((prev) => {
        let { x, y } = prev;
        const speed = baseSpeed;

        const movingDiagonally =
          (keys.up || keys.down) && (keys.left || keys.right);
        const adjustedSpeed = movingDiagonally ? speed * 0.7 : speed;

        if (keys.up && y > 5) y -= adjustedSpeed;
        if (keys.down && y < 95) y += adjustedSpeed;
        if (keys.left && x > 5) x -= adjustedSpeed;
        if (keys.right && x < 95) x += adjustedSpeed;

        const absoluteX = bridgeBounds.left + (x / 100) * bridgeBounds.width;
        const absoluteY = bridgeBounds.top + (y / 100) * bridgeBounds.height;

        setTimeout(() => {
          setPlayerPosition({ x: absoluteX, y: absoluteY });
        }, 0);

        return { x, y };
      });
    };

    let lastTime = 0;
    const animationFrame = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > 16) {
        movePlayer();
        lastTime = timestamp;
      }

      if (!gamePaused) {
        requestAnimationFrame(animationFrame);
      }
    };

    const animationId = requestAnimationFrame(animationFrame);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [bridgeBounds, gamePaused, setPlayerPosition]);

  const getDirectionEmoji = () => {
    switch (playerDirection) {
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
      }}
    >
      <div className="text-xl">{getDirectionEmoji()}</div>
    </div>
  );
};
