const Bullet = ({ position, direction }) => {
  const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);

  return (
    <div
      className="absolute bg-yellow-300 rounded-full h-2 w-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 999,
        boxShadow: "0 0 4px rgba(255, 255, 0, 0.8)",
      }}
    >
      <div
        className="absolute w-4 h-0.5 bg-yellow-500 origin-center opacity-70"
        style={{
          transform: `rotate(${angle + 180}deg)`,
          left: "50%",
          top: "50%",
        }}
      />
    </div>
  );
};

export default Bullet;
