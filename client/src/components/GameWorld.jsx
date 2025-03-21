import Player from "./Player";
import Zombie from "./Zombie";
import Orphanage from "./Orphanage";
import Bullet from "./Bullet";

const GameWorld = ({
  bridgeRef,
  playerPosition,
  zombies,
  gameState,
  bullets,
  playerDirection,
  setPlayerDirection,
  onShoot,
}) => {
  const { gameOver, gamePaused, orphanageHealth } = gameState;
  const bridgeBounds = bridgeRef.current?.getBoundingClientRect();
  const orphanagePosition = bridgeBounds ? bridgeBounds.height - 60 : 0;

  return (
    <>
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
            position={playerPosition}
            gamePaused={gamePaused}
            onShoot={onShoot}
            direction={playerDirection}
            setDirection={setPlayerDirection}
          />
        )}

        {bridgeBounds &&
          zombies.map((zombie) => (
            <Zombie
              key={zombie.id}
              position={zombie}
              gamePaused={gamePaused || gameOver}
              orphanagePosition={orphanagePosition}
            />
          ))}

        {bullets.map((bullet) => (
          <Bullet
            key={bullet.id}
            position={bullet.position}
            direction={bullet.direction}
          />
        ))}

        <Orphanage health={orphanageHealth} maxHealth={300} />
      </div>

      <div className="w-1/3 h-full bg-blue-700 flex items-center justify-center">
        <p className="text-white text-2xl font-bold rotate-[15deg]">🌊 River</p>
      </div>
    </>
  );
};

export default GameWorld;
