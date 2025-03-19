import { useRef, useState, useEffect } from "react";
import { Player } from "./Player";
import { Zombie } from "./Zombie";

const Game = () => {
  const bridgeRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 90 });
  const [zombies, setZombies] = useState([]);
  const [zombieCount, setZombieCount] = useState(0);
  const [bridgeBounds, setBridgeBounds] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const playerAbsolutePositionRef = useRef({ x: 0, y: 0 });
  const gameStateRef = useRef({
    isOver: false,
    isPaused: false,
  });

  useEffect(() => {
    gameStateRef.current = {
      isOver: gameOver,
      isPaused: gamePaused,
    };
  }, [gameOver, gamePaused]);

  useEffect(() => {
    const handleResize = () => {
      if (bridgeRef.current) {
        const rect = bridgeRef.current.getBoundingClientRect();
        setBridgeBounds({
          left: rect.left,
          right: rect.right,
          width: rect.width,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
        });
      }
    };

    handleResize();

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  useEffect(() => {
    if (bridgeBounds) {
      const initialX = bridgeBounds.left + bridgeBounds.width / 2;
      const initialY = bridgeBounds.top + bridgeBounds.height * 0.9;
      playerAbsolutePositionRef.current = { x: initialX, y: initialY };
      setPlayerPosition({ x: initialX, y: initialY });
    }
  }, [bridgeBounds]);

  useEffect(() => {
    playerAbsolutePositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    if (!bridgeBounds) return;

    let spawnIntervalId;

    const spawnZombie = () => {
      if (gameStateRef.current.isOver || gameStateRef.current.isPaused) return;

      const spawnRate = Math.max(2000 - difficulty * 150, 600);

      const newZombie = {
        id: zombieCount,
        x: Math.random() * (bridgeBounds.width - 40) + 20,
        y: 30,
        speed: 0.5 + Math.random() * 0.3 + difficulty * 0.1,
      };

      setZombies((prev) => [...prev, newZombie]);
      setZombieCount((prev) => prev + 1);

      spawnIntervalId = setTimeout(spawnZombie, spawnRate);
    };

    spawnIntervalId = setTimeout(spawnZombie, 1000);

    return () => clearTimeout(spawnIntervalId);
  }, [bridgeBounds, zombieCount, difficulty]);

  useEffect(() => {
    if (!bridgeBounds) return;

    let collisionCheckId;

    const checkCollision = () => {
      if (gameStateRef.current.isOver || gameStateRef.current.isPaused) {
        collisionCheckId = requestAnimationFrame(checkCollision);
        return;
      }

      const playerRadius = 20;
      const zombieRadius = 16;
      const collisionDistance = playerRadius + zombieRadius;

      const currentPlayerPos = playerAbsolutePositionRef.current;

      setZombies((prevZombies) => {
        const onScreenZombies = prevZombies.filter(
          (zombie) => zombie.y < bridgeBounds.height + 50
        );

        for (const zombie of onScreenZombies) {
          const zombieAbsX = bridgeBounds.left + zombie.x;
          const zombieAbsY = bridgeBounds.top + zombie.y;

          const dx = zombieAbsX - currentPlayerPos.x;
          const dy = zombieAbsY - currentPlayerPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < collisionDistance) {
            setGameOver(true);
            return onScreenZombies;
          }
        }
        return onScreenZombies;
      });

      collisionCheckId = requestAnimationFrame(checkCollision);
    };

    collisionCheckId = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(collisionCheckId);
  }, [bridgeBounds]);

  useEffect(() => {
    if (gameOver || gamePaused) return;

    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        const newScore = prev + 1;

        if (newScore % 20 === 0 && newScore > 0) {
          setDifficulty((prevDifficulty) => Math.min(prevDifficulty + 1, 10));
        }
        return newScore;
      });
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [gameOver, gamePaused]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "p" || e.key === "P") {
        setGamePaused((prev) => !prev);
      } else if ((e.key === "r" || e.key === "R") && gameOver) {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  const restartGame = () => {
    setZombies([]);
    setZombieCount(0);
    setScore(0);
    setGameOver(false);
    setGamePaused(false);
    setDifficulty(1);

    if (bridgeBounds) {
      const initialX = bridgeBounds.left + bridgeBounds.width / 2;
      const initialY = bridgeBounds.top + bridgeBounds.height * 0.9;
      playerAbsolutePositionRef.current = { x: initialX, y: initialY };
      setPlayerPosition({ x: initialX, y: initialY });
    }
  };

  const updatePlayerPosition = (pos) => {
    playerAbsolutePositionRef.current = pos;
    setPlayerPosition(pos);
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      <div className="w-1/3 h-full bg-blue-700 flex items-center justify-center">
        <p className="text-white text-2xl font-bold rotate-[-15deg]">
          🌊 River
        </p>
      </div>

      <div
        ref={bridgeRef}
        className="w-1/3 h-full bg-gray-600 relative border-x-8 border-gray-800"
      >
        {bridgeBounds && !gameOver && (
          <Player
            setPlayerPosition={updatePlayerPosition}
            bridgeBounds={bridgeBounds}
            gamePaused={gamePaused}
          />
        )}

        {bridgeBounds &&
          zombies.map((zombie) => (
            <Zombie
              key={zombie.id}
              initialPosition={zombie}
              playerPosition={playerPosition}
              bridgeBounds={bridgeBounds}
              gameOver={gameOver}
              gamePaused={gamePaused}
            />
          ))}

        <p className="absolute bottom-4 w-full text-center text-white font-bold">
          🌉 Bridge
        </p>

        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Score: {score}
          </div>
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Zombies: {zombies.length}
          </div>
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Level: {difficulty}
          </div>
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <h2 className="text-3xl text-red-500 font-bold mb-4">Game Over!</h2>
            <p className="text-white text-xl mb-6">Final Score: {score}</p>
            <button
              onClick={restartGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </button>
            <p className="text-white text-sm mt-4">Press 'R' to restart</p>
          </div>
        )}

        {gamePaused && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <h2 className="text-3xl text-yellow-500 font-bold mb-4">Paused</h2>
            <p className="text-white text-xl mb-6">Current Score: {score}</p>
            <button
              onClick={() => setGamePaused(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Resume Game
            </button>
            <p className="text-white text-sm mt-4">Press 'P' to resume</p>
          </div>
        )}
      </div>

      <div className="w-1/3 h-full bg-blue-700 flex items-center justify-center">
        <p className="text-white text-2xl font-bold rotate-[15deg]">🌊 River</p>
      </div>
    </div>
  );
};

export default Game;
