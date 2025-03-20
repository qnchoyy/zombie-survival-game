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
  const [orphanageHealth, setOrphanageHealth] = useState(100);

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!bridgeBounds || gameOver || gamePaused) return;

    const spawnZombie = () => {
      const spawnRate = Math.max(2000 - difficulty * 150, 600);

      const newZombie = {
        id: Date.now() + Math.random(),
        x: Math.random() * (bridgeBounds.width - 40) + 20,
        y: 30,
        speed: 0.5 + Math.random() * 0.3 + difficulty * 0.1,
      };

      setZombies((prev) => [...prev, newZombie]);
      setZombieCount((prev) => prev + 1);
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
  }, [bridgeBounds, difficulty, gameOver, gamePaused]);

  useEffect(() => {
    if (!bridgeBounds || gameOver || gamePaused) return;

    const gameLoop = setInterval(() => {
      const playerRadius = 20;

      const zombieRadius = 16;

      const collisionDistance = playerRadius + zombieRadius;

      const orphanageY = bridgeBounds.height - 50;

      setZombies((prevZombies) => {
        const remainingZombies = [];
        let orphanageDamage = 0;

        for (const zombie of prevZombies) {
          const zombieAbsX = bridgeBounds.left + zombie.x;
          const zombieAbsY = bridgeBounds.top + zombie.y;

          const dx = zombieAbsX - playerPosition.x;
          const dy = zombieAbsY - playerPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < collisionDistance) {
            setTimeout(() => setGameOver(true), 0);
            return prevZombies;
          }

          if (zombie.y >= orphanageY) {
            orphanageDamage += 10;
          } else {
            remainingZombies.push(zombie);
          }
        }

        if (orphanageDamage > 0) {
          setTimeout(() => {
            setOrphanageHealth((prev) => {
              const newHealth = Math.max(0, prev - orphanageDamage);
              if (newHealth <= 0) {
                setGameOver(true);
              }
              return newHealth;
            });
          }, 0);
        }

        return remainingZombies;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [bridgeBounds, playerPosition, gameOver, gamePaused]);

  useEffect(() => {
    if (gameOver || gamePaused) return;

    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        const newScore = prev + 1;

        if (newScore % 20 === 0 && newScore > 0) {
          setDifficulty((prevDiff) => Math.min(prevDiff + 1, 10));
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
    setOrphanageHealth(100);
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
            setPlayerPosition={setPlayerPosition}
            bridgeBounds={bridgeBounds}
            gamePaused={gamePaused}
          />
        )}

        {bridgeBounds &&
          zombies.map((zombie) => (
            <Zombie
              key={zombie.id}
              initialPosition={zombie}
              bridgeBounds={bridgeBounds}
              gameOver={gameOver}
              gamePaused={gamePaused}
            />
          ))}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-700 flex items-center justify-center">
          <p className="text-white font-bold">Orphanage</p>
        </div>

        <div className="absolute bottom-14 left-4 right-4 h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${orphanageHealth}%` }}
          ></div>
        </div>

        <p className="absolute bottom-20 w-full text-center text-white font-bold">
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
            <p className="text-white text-lg mb-6">
              {orphanageHealth <= 0
                ? "The orphanage was destroyed!"
                : "You were caught by zombies!"}
            </p>
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
