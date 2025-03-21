import { useState, useEffect, useRef } from "react";

const usePlayerMovement = ({ bridgeRef, gamePaused }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 90 });
  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (bridgeRef.current) {
      const centerX = 50;
      const bottomY = 90;
      setPlayerPosition({ x: centerX, y: bottomY });
    }
  }, [bridgeRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gamePaused) return;

      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") keysRef.current.up = true;
      if (key === "arrowdown" || key === "s") keysRef.current.down = true;
      if (key === "arrowleft" || key === "a") keysRef.current.left = true;
      if (key === "arrowright" || key === "d") keysRef.current.right = true;
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") keysRef.current.up = false;
      if (key === "arrowdown" || key === "s") keysRef.current.down = false;
      if (key === "arrowleft" || key === "a") keysRef.current.left = false;
      if (key === "arrowright" || key === "d") keysRef.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePaused]);
  useEffect(() => {
    if (gamePaused || !bridgeRef.current) return;

    const baseSpeed = 0.5;

    const movePlayer = () => {
      const keys = keysRef.current;
      setPlayerPosition((prev) => {
        let { x, y } = prev;

        const movingDiagonally =
          (keys.up || keys.down) && (keys.left || keys.right);
        const speed = movingDiagonally ? baseSpeed * 0.7 : baseSpeed;

        if (keys.up && y > 5) y -= speed;
        if (keys.down && y < 95) y += speed;
        if (keys.left && x > 5) x -= speed;
        if (keys.right && x < 95) x += speed;

        return { x, y };
      });
    };

    const interval = setInterval(movePlayer, 16);
    return () => clearInterval(interval);
  }, [gamePaused, bridgeRef]);

  return { playerPosition, keysRef, setPlayerPosition };
};

export default usePlayerMovement;
