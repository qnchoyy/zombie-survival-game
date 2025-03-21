const PauseModal = ({ score, onResume }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <h2 className="text-3xl text-yellow-500 font-bold mb-4">Paused</h2>
      <p className="text-white text-xl mb-6">Current Score: {score}</p>
      <button
        onClick={onResume}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Resume Game
      </button>
      <p className="text-white text-sm mt-4">Press 'P' to resume</p>
    </div>
  );
};

export default PauseModal;
