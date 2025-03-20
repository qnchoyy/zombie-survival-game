import React from "react";

export const Orphanage = ({ health, bridgeBounds }) => {
  const healthBarWidth = `${health}%`;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
      style={{
        zIndex: 999,
      }}
    >
      <div className="w-full h-2 bg-gray-300 mb-1">
        <div
          className="h-full bg-red-600"
          style={{ width: healthBarWidth }}
        ></div>
      </div>

      <div className="w-full h-16 bg-yellow-100 flex items-center justify-center border-t-4 border-gray-800">
        <div className="flex items-center">
          <span className="text-lg mr-1">🏠</span>
          <span className="text-sm mr-1">👶</span>
          <span className="text-sm">👧</span>
        </div>
      </div>
    </div>
  );
};
