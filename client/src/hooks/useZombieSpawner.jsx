import { useState, useEffect } from "react";

const useZombieSpawner = ({ bridgeRef, difficulty, gameOver, gamePaused }) => {
  const [zombies, setZombies] = useState([]);

  useEffect(() => {
    if (!bridgeRef.current || gameOver || gamePaused) return;

    const spawnZombie = () => {
      const rect = bridgeRef.current.getBoundingClientRect();
      const spawnRate = Math.max(2000 - difficulty * 150, 600);

      const newZombie = {
        id: Date.now() + Math.random(),
        x: Math.random() * (rect.width - 40) + 20,
        y: 30,
        speed: 0.5 + Math.random() * 0.3 + difficulty * 0.1,
      };

      setZombies((prev) => [...prev, newZombie]);
    };

    const initialSpawn = setTimeout(spawnZombie, 1000);

    const spawnInterval = setInterval(() => {
      if (!gameOver && !gamePaused) {
        spawnZombie();
      }
    }, Math.max(2000 - difficulty * 150, 600));

    return () => {
      clearTimeout(initialSpawn);
      clearInterval(spawnInterval);
    };
  }, [bridgeRef, difficulty, gameOver, gamePaused]);

  useEffect(() => {
    if (!bridgeRef.current || gameOver || gamePaused) return;

    const moveZombies = () => {
      const rect = bridgeRef.current.getBoundingClientRect();
      const orphanagePosition = rect.height - 60;

      setZombies((prev) =>
        prev.map((zombie) => {
          if (zombie.y >= orphanagePosition) return zombie;

          return {
            ...zombie,
            y: zombie.y + zombie.speed,
          };
        })
      );
    };

    const moveInterval = setInterval(moveZombies, 16);
    return () => clearInterval(moveInterval);
  }, [bridgeRef, gameOver, gamePaused]);

  return { zombies, setZombies };
};

export default useZombieSpawner;
