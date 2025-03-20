import { useEffect, useState, useRef } from "react";

export const Zombie = ({
  initialPosition,
  bridgeBounds,
  gameOver,
  gamePaused,
}) => {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const speedRef = useRef(initialPosition.speed || 0.8);

  useEffect(() => {
    if (gameOver || gamePaused) return;

    let lastTime = 0;

    const moveZombie = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 16;
      lastTime = timestamp;

      setPosition((prev) => {
        const targetY = bridgeBounds.height - 20;
        const speed = speedRef.current * Math.min(deltaTime, 3);

        return {
          x: prev.x,
          y: Math.min(prev.y + speed, targetY),
        };
      });

      if (!gameOver && !gamePaused) {
        requestAnimationFrame(moveZombie);
      }
    };

    const animationId = requestAnimationFrame(moveZombie);

    return () => cancelAnimationFrame(animationId);
  }, [bridgeBounds, gameOver, gamePaused]);

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: Math.floor(position.y),
      }}
    >
      <div className="text-2xl">🧟</div>
      <div className="absolute w-8 h-8 bg-green-600 rounded-full opacity-50 -z-10"></div>
    </div>
  );
};
