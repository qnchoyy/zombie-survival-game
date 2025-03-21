const GameOverModal = ({ score, orphanageHealth, onRestart, onExit }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <h2 className="text-3xl text-red-500 font-bold mb-4">Game Over!</h2>
      <p className="text-white text-xl mb-6">Final Score: {score}</p>
      <p className="text-white text-lg mb-6">
        {orphanageHealth <= 0 ? "The orphanage was destroyed!" : "Game Over!"}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Play Again
        </button>
        <button
          onClick={onExit}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Main Menu
        </button>
      </div>
      <p className="text-white text-sm mt-4">Press 'R' to restart</p>
    </div>
  );
};

export default GameOverModal;
