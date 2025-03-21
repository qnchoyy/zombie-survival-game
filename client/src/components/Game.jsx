import { useState, useEffect } from "react";
import GameWorld from "./GameWorld";
import GameHUD from "./GameHUD";
import GameOverModal from "./GameOverModal";
import PauseModal from "./PauseModal";
import useGameLogic from "../hooks/useGameLogic";

const Game = ({ onGameExit }) => {
  const {
    gameState,
    playerPosition,
    zombies,
    bridgeRef,
    gameActions,
    handleKeyPress,
  } = useGameLogic();

  const { score, orphanageHealth, gameOver, gamePaused, difficulty } =
    gameState;

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <GameWorld
        bridgeRef={bridgeRef}
        playerPosition={playerPosition}
        zombies={zombies}
        gameState={gameState}
      />

      <GameHUD
        score={score}
        zombieCount={zombies.length}
        difficulty={difficulty}
        orphanageHealth={orphanageHealth}
      />

      {gameOver && (
        <GameOverModal
          score={score}
          orphanageHealth={orphanageHealth}
          onRestart={gameActions.restartGame}
          onExit={onGameExit}
        />
      )}

      {gamePaused && !gameOver && (
        <PauseModal
          score={score}
          onResume={() => gameActions.setGamePaused(false)}
        />
      )}
    </div>
  );
};

export default Game;
