const Zombie = ({ position, gamePaused, orphanagePosition }) => {
  const hasReachedOrphanage = position.y >= orphanagePosition;

  if (hasReachedOrphanage) {
    return null;
  }

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: Math.floor(position.y),
        transition: gamePaused ? "none" : "top 0.3s linear",
      }}
    >
      <div className="text-2xl">🧟</div>
      <div className="absolute w-8 h-8 bg-green-600 rounded-full opacity-50 -z-10"></div>
    </div>
  );
};

export default Zombie;
