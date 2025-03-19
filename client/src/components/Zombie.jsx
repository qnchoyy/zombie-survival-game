import { useEffect, useState, useRef } from "react";

export const Zombie = ({
  initialPosition,
  playerPosition,
  bridgeBounds,
  gameOver,
  gamePaused,
}) => {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const zombieRef = useRef(null);
  const speedRef = useRef(initialPosition.speed || 0.8);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    if (gameOver || gamePaused) return;

    let animationFrameId;

    const updateZombiePosition = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 16;
      lastUpdateTimeRef.current = now;

      setPosition((prev) => {
        const targetX = playerPosition.x - bridgeBounds.left;
        const targetY = playerPosition.y - bridgeBounds.top;

        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const speed = speedRef.current * deltaTime;
          const moveX = (dx / distance) * speed;
          const moveY = (dy / distance) * speed;

          return {
            x: Math.max(10, Math.min(prev.x + moveX, bridgeBounds.width - 10)),
            y: Math.max(10, Math.min(prev.y + moveY, bridgeBounds.height - 10)),
          };
        }
        return prev;
      });

      if (!gameOver && !gamePaused) {
        animationFrameId = requestAnimationFrame(updateZombiePosition);
      }
    };

    animationFrameId = requestAnimationFrame(updateZombiePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPosition, bridgeBounds, gameOver, gamePaused]);

  return (
    <div
      ref={zombieRef}
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
