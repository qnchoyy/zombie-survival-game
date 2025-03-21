const StartScreen = ({ onStartGame }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-4xl text-white font-bold mb-8">
        Zombie Bridge Survival
      </h1>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl text-white font-bold mb-4">How to Play</h2>
        <ul className="text-white space-y-2 mb-6">
          <li>
            • Use <span className="font-bold">W,A,S,D</span> or{" "}
            <span className="font-bold">Arrow Keys</span> to move
          </li>
          <li>
            • <span className="font-bold">Move your mouse</span> to aim
          </li>
          <li>
            • Use <span className="font-bold">Left Mouse Button</span> to shoot
          </li>
          <li>• Defend the orphanage from zombies</li>
          <li>• Shoot zombies to earn extra points (+5 per zombie)</li>
          <li>• Don't let zombies reach the orphanage</li>
          <li>• Each zombie reduces orphanage health by 30 points</li>
          <li>• Game ends when orphanage health reaches 0</li>
          <li>
            • Press <span className="font-bold">P</span> to pause the game
          </li>
          <li>
            • Press <span className="font-bold">R</span> to restart after game
            over
          </li>
        </ul>
        <button
          onClick={onStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
