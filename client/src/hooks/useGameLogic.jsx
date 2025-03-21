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
    bridgeRef,
    gameActions: {
      restartGame,
      setGamePaused: (paused) =>
        setGameState((prev) => ({ ...prev, gamePaused: paused })),
    },
    handleKeyPress,
  };
};

export default useGameLogic;
