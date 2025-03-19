import { useState } from "react";
import Game from "./components/Game";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-800">
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
            <li>• Avoid the zombies for as long as possible</li>
            <li>
              • Press <span className="font-bold">P</span> to pause the game
            </li>
            <li>
              • Press <span className="font-bold">R</span> to restart after game
              over
            </li>
          </ul>
          <button
            onClick={() => setGameStarted(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return <Game />;
};

export default App;
