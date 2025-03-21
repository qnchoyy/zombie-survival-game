import { useState } from "react";
import Game from "./components/Game";
import StartScreen from "./components/StartScreen";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="h-screen w-full bg-gray-800 overflow-hidden">
      {gameStarted ? (
        <Game onGameExit={() => setGameStarted(false)} />
      ) : (
        <StartScreen onStartGame={() => setGameStarted(true)} />
      )}
    </div>
  );
};

export default App;
