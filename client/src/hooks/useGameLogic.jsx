import { useState, useEffect, useRef, useCallback } from "react";
import usePlayerMovement from "./usePlayerMovement";
import useZombieSpawner from "./useZombieSpawner";

const useGameLogic = () => {
  const bridgeRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    orphanageHealth: 300,
    gameOver: false,
    gamePaused: false,
    difficulty: 1,
  });
  const [bullets, setBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState("up");

  const { playerPosition, keysRef, setPlayerPosition } = usePlayerMovement({
    bridgeRef,
    gamePaused: gameState.gameOver || gameState.gamePaused,
  });

  const { zombies, setZombies } = useZombieSpawner({
    bridgeRef,
    difficulty: gameState.difficulty,
    gameOver: gameState.gameOver,
    gamePaused: gameState.gamePaused,
  });

  const handleShoot = useCallback((playerPos, directionVector) => {
    const newBullet = {
      id: Date.now(),
      position: { ...playerPos },
      direction: directionVector,
      speed: 2,
    };
    setBullets((prev) => [...prev, newBullet]);
  }, []);

  useEffect(() => {
    if (gameState.gameOver || gameState.gamePaused || !bridgeRef.current)
      return;

    const moveBullets = () => {
      setBullets((prev) =>
        prev.filter((bullet) => {
          let newX = bullet.position.x + bullet.direction.x * bullet.speed;
          let newY = bullet.position.y + bullet.direction.y * bullet.speed;

          if (newX < 0 || newX > 100 || newY < 0 || newY > 100) {
            return false;
          }

          bullet.position.x = newX;
          bullet.position.y = newY;
          return true;
        })
      );
    };

    const bulletInterval = setInterval(moveBullets, 16);
    return () => clearInterval(bulletInterval);
  }, [gameState.gameOver, gameState.gamePaused]);

  useEffect(() => {
    if (gameState.gameOver || gameState.gamePaused || !bridgeRef.current)
      return;

    const checkBulletCollisions = () => {
      const bridgeBounds = bridgeRef.current.getBoundingClientRect();
      const bulletWidth = 4;
      const zombieWidth = 16;

      let hitZombies = [];
      let remainingBullets = [];

      bullets.forEach((bullet) => {
        const bulletX = (bullet.position.x / 100) * bridgeBounds.width;
        const bulletY = (bullet.position.y / 100) * bridgeBounds.height;

        let bulletHitZombie = false;

        zombies.forEach((zombie) => {
          const dx = bulletX - zombie.x;
          const dy = bulletY - zombie.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < zombieWidth + bulletWidth) {
            hitZombies.push(zombie.id);
            bulletHitZombie = true;

            setGameState((prev) => ({
              ...prev,
              score: prev.score + 5,
            }));
          }
        });

        if (!bulletHitZombie) {
          remainingBullets.push(bullet);
        }
      });

      if (hitZombies.length > 0) {
        setZombies((prev) =>
          prev.filter((zombie) => !hitZombies.includes(zombie.id))
        );
      }

      if (bullets.length !== remainingBullets.length) {
        setBullets(remainingBullets);
      }
    };

    const collisionInterval = setInterval(checkBulletCollisions, 16);
    return () => clearInterval(collisionInterval);
  }, [bullets, zombies, gameState.gameOver, gameState.gamePaused, setZombies]);

  useEffect(() => {
    if (gameState.gameOver || gameState.gamePaused || !bridgeRef.current)
      return;

    const orphanagePosition =
      bridgeRef.current.getBoundingClientRect().height - 60;
    const checkZombiesReachedOrphanage = () => {
      setZombies((prevZombies) => {
        const newZombies = [...prevZombies];
        let damageToOrphanage = 0;

        const remainingZombies = newZombies.filter((zombie) => {
          if (zombie.y >= orphanagePosition) {
            damageToOrphanage += 30;
            return false;
          }
          return true;
        });

        if (damageToOrphanage > 0) {
          setGameState((prev) => {
            const newHealth = Math.max(
              0,
              prev.orphanageHealth - damageToOrphanage
            );
            return {
              ...prev,
              orphanageHealth: newHealth,
              gameOver: newHealth <= 0,
            };
          });
        }

        return remainingZombies;
      });
    };

    const checkInterval = setInterval(checkZombiesReachedOrphanage, 100);
    return () => clearInterval(checkInterval);
  }, [gameState.gameOver, gameState.gamePaused, setZombies]);

  useEffect(() => {
    if (gameState.gameOver || gameState.gamePaused) return;

    const scoreInterval = setInterval(() => {
      setGameState((prev) => {
        const newScore = prev.score + 1;
        const newDifficulty =
          newScore % 20 === 0 && newScore > 0
            ? Math.min(prev.difficulty + 1, 10)
            : prev.difficulty;

        return {
          ...prev,
          score: newScore,
          difficulty: newDifficulty,
        };
      });
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [gameState.gameOver, gameState.gamePaused]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "p" || e.key === "P") {
        setGameState((prev) => ({
          ...prev,
          gamePaused: !prev.gamePaused,
        }));
      } else if ((e.key === "r" || e.key === "R") && gameState.gameOver) {
        restartGame();
      }
    },
    [gameState.gameOver]
  );

  const restartGame = useCallback(() => {
    setZombies([]);
    setBullets([]);
    setGameState({
      score: 0,
      orphanageHealth: 300,
      gameOver: false,
      gamePaused: false,
      difficulty: 1,
    });

    if (bridgeRef.current) {
      const centerX = 50;
      const bottomY = 90;
      setPlayerPosition({ x: centerX, y: bottomY });
    }
  }, [setZombies, setPlayerPosition]);

  return {
    gameState,
    playerPosition,
    zombies,
    bullets,
    playerDirection,
    setPlayerDirection,
    bridgeRef,
    gameActions: {
      restartGame,
      setGamePaused: (paused) =>
        setGameState((prev) => ({ ...prev, gamePaused: paused })),
      handleShoot,
    },
    handleKeyPress,
  };
};

export default useGameLogic;
