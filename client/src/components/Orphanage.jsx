const Orphanage = ({ health, maxHealth }) => {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (health / maxHealth) * 100)
  );

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-700 flex items-center justify-center">
        <p className="text-white font-bold">Orphanage</p>
      </div>

      <div className="absolute bottom-14 left-4 right-4 h-4 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <p className="text-white font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
          HP: {health}/{maxHealth}
        </p>
      </div>
    </>
  );
};

export default Orphanage;
