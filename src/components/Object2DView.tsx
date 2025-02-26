
interface ObjectState {
  x: number;
  y: number;
  color: string;
}

function Object2DView({objects}: {objects: {[id: string]: ObjectState}}) {
  return (
    <div
    style={{
      marginTop: "20px",
      width: "300px",
      height: "300px",
      border: "1px solid #ccc",
      position: "relative",
      background: "#f0f0f0",
    }}
  >
    {Object.entries(objects).map(([id, { x, y, color }]) => (
      <div
        key={id}
        style={{
          width: "20px",
          height: "20px",
          background: color,
          position: "absolute",
          left: `${x * 20}px`,
          top: `${y * 20}px`,
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
  )
}

export default Object2DView