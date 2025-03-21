const GameHUD = ({ score, zombieCount, difficulty, orphanageHealth }) => {
  return (
    <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
      <div className="w-1/3 px-2">
        <div className="flex justify-between">
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Score: {score}
          </div>
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Zombies: {zombieCount}
          </div>
          <div className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
            Level: {difficulty}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
