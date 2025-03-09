import { useState, useEffect, useRef } from "react";

interface Cell {
  x: number;
  y: number;
  state: 0 | 1 | 2 | 3;
}

interface Map2DViewProps {
  initialGrid?: string;
  onGridChange?: (gridData: string) => void;
}

const Map2DView: React.FC<Map2DViewProps> = ({ initialGrid, onGridChange }) => {
  const [rows, setRows] = useState<number>(() => (initialGrid ? initialGrid.trim().split("\n").length : 4));
  const [cols, setCols] = useState<number>(() => (initialGrid ? initialGrid.trim().split("\n")[0].trim().split(" ").length : 8));
  const [grid, setGrid] = useState<Cell[][]>(() => {
    if (initialGrid) {
      const rowsData = initialGrid.trim().split("\n");
      return rowsData.map((row, y) =>
        row.trim().split(" ").map((state, x) => ({
          x,
          y,
          state: parseInt(state) as 0 | 1 | 2 | 3,
        }))
      );
    }
    return Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ x, y, state: 0 }))
    );
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (onGridChange) {
      onGridChange(getGridData());
    }
  }, [grid]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar el tamaño del canvas al contenedor
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const cellSize = Math.floor(width / cols); // Tamaño de celda basado en columnas
        const height = cellSize * rows; // Altura proporcional a filas
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.strokeStyle = "black";
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

          const cell = grid[y]?.[x] || { state: 0 };
          ctx.fillStyle =
            cell.state === 0 ? "white" :
            cell.state === 1 ? "green" :
            cell.state === 2 ? "blue" : "red";
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    };

    const handleCanvasClick = (event: MouseEvent) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellWidth);
      const y = Math.floor((event.clientY - rect.top) / cellHeight);

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          const currentState = newGrid[y][x].state;
          let nextState: 0 | 1 | 2 | 3;

          if (event.button === 0) {
            const playerCount = newGrid.flat().filter(cell => cell.state === 2).length;
            const goalCount = newGrid.flat().filter(cell => cell.state === 3).length;

            nextState = currentState === 0 ? 1 :
                        currentState === 1 && playerCount === 0 ? 2 :
                        currentState === 2 && goalCount === 0 ? 3 : 0;
            if ((nextState === 2 && playerCount > 0) || (nextState === 3 && goalCount > 0)) return prev;
          } else if (event.button === 2) {
            nextState = 0;
          } else {
            return prev;
          }

          newGrid[y][x] = { x, y, state: nextState };
          return newGrid;
        });
      }
    };

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCanvasClick);
    drawGrid();

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("contextmenu", handleCanvasClick);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [grid, rows, cols]);

  const getGridData = () => {
    return grid.map(row => row.map(cell => cell.state).join(" ")).join("\n");
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = Math.max(1, Math.min(10, parseInt(e.target.value) || 4));
    setRows(newRows);
    setGrid((prev) => {
      const newGrid = Array.from({ length: newRows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => prev[y]?.[x] || { x, y, state: 0 })
      );
      return newGrid;
    });
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCols = Math.max(1, Math.min(20, parseInt(e.target.value) || 8));
    setCols(newCols);
    setGrid((prev) => {
      const newGrid = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: newCols }, (_, x) => prev[y]?.[x] || { x, y, state: 0 })
      );
      return newGrid;
    });
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Mapa a la izquierda */}
      <div style={{ flex: "0 0 50%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          style={{ 
            border: "1px solid black", 
            cursor: "pointer", 
            width: "100%", 
            height: "100%", 
            display: "block" 
          }}
        />
      </div>

      {/* Información a la derecha */}
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Controles */}
        <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <label>
            Filas (1-10):
            <input
              type="number"
              value={rows}
              onChange={handleRowsChange}
              min="1"
              max="10"
              style={{ marginLeft: "5px", width: "60px" }}
            />
          </label>
          <label style={{ marginLeft: "20px" }}>
            Columnas (1-20):
            <input
              type="number"
              value={cols}
              onChange={handleColsChange}
              min="1"
              max="20"
              style={{ marginLeft: "5px", width: "60px" }}
            />
          </label>
        </div>

        {/* Colores */}
        <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p><strong>Colores y Significados:</strong></p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ color: "black" }}><span style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "white", border: "1px solid black", marginRight: "5px" }}></span>Blanco (0): Vacío</li>
            <li style={{ color: "black" }}><span style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "green", border: "1px solid black", marginRight: "5px" }}></span>Verde (1): Terreno</li>
            <li style={{ color: "black" }}><span style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "blue", border: "1px solid black", marginRight: "5px" }}></span>Azul (2): Jugador</li>
            <li style={{ color: "black" }}><span style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "red", border: "1px solid black", marginRight: "5px" }}></span>Rojo (3): Meta</li>
          </ul>
        </div>

        {/* Matriz */}
        <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", flex: "1", overflow: "auto" }}>
          <h3>Matriz</h3>
          <pre style={{ fontSize: "12px" }}>{getGridData()}</pre>
        </div>
      </div>
    </div>
  );
};

export default Map2DView;