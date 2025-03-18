import React, { useRef } from "react";
import { Player } from "./Player";

const Game = () => {
  const bridgeRef = useRef(null);

  return (
    <div className="relative w-full h-screen flex">
      <div className="w-1/3 h-full bg-blue-800 flex items-center justify-center">
        <p className="text-white text-2xl font-bold rotate-[-15deg]">
          🌊 River
        </p>
      </div>

      <div
        ref={bridgeRef}
        className="w-1/3 h-full bg-gray-700 relative border-x-8 border-gray-900"
      >
        <Player containerRef={bridgeRef} />
        <p className="absolute bottom-4 w-full text-center text-white font-bold">
          🌉 Bridge
        </p>
      </div>

      <div className="w-1/3 h-full bg-blue-800 flex items-center justify-center">
        <p className="text-white text-2xl font-bold rotate-[15deg]">🌊 River</p>
      </div>
    </div>
  );
};

export default Game;
