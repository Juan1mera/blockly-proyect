import { useState, useEffect, useRef } from "react";

interface Cell {
  x: number;
  y: number;
  state: 0 | 1 | 2 | 3; // 0: vacío, 1: terreno, 2: jugador, 3: meta
}

interface Map2DViewProps {
  initialGrid?: string; // Opcional: datos iniciales en formato "2 0 1 0 1 1 1 1\n..."
  onGridChange?: (gridData: string) => void; // Callback para pasar datos al padre
}

const Map2DView: React.FC<Map2DViewProps> = ({ initialGrid, onGridChange }) => {
  const [rows, setRows] = useState<number>(4); // Número de filas, editable
  const [cols, setCols] = useState<number>(8); // Número de columnas, editable
  const [grid, setGrid] = useState<Cell[][]>(() => {
    if (initialGrid) {
      const rowsData = initialGrid.trim().split("\n");
      // const rowLength = rowsData[0].trim().split(" ").length;
      // const colLength = rowsData.length;
      return rowsData.map((row, y) =>
        row.trim().split(" ").map((state, x) => ({
          x,
          y,
          state: parseInt(state) as 0 | 1 | 2 | 3,
        }))
      );
    }
    return Array(rows).fill(Array(cols).fill({ x: 0, y: 0, state: 0 }));
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (onGridChange) {
      onGridChange(getGridData());
    }
  }, [grid, onGridChange]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = canvas.width / cols; // Ajustar según columnas
    const cellHeight = canvas.height / rows; // Ajustar según filas

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.strokeStyle = "black";
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

          const cell = grid[y]?.[x] || { state: 0 }; // Asegurar acceso seguro
          switch (cell.state) {
            case 0: // Vacío
              ctx.fillStyle = "white";
              break;
            case 1: // Terreno
              ctx.fillStyle = "green";
              break;
            case 2: // Jugador
              ctx.fillStyle = "blue";
              break;
            case 3: // Meta
              ctx.fillStyle = "red";
              break;
          }
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    };

    const handleCanvasClick = (event: MouseEvent) => {
      event.preventDefault(); // Prevenir el menú contextual por defecto en clic derecho

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellWidth);
      const y = Math.floor((event.clientY - rect.top) / cellHeight);

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        if (event.button === 0) { // Clic izquierdo: ciclo de estados
          setGrid((prev) => {
            const newGrid = prev.map((row, i) => (i === y ? [...row] : row));
            const currentState = newGrid[y]?.[x]?.state || 0;

            // Contar jugador y meta actuales
            let playerCount = 0;
            let goalCount = 0;
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                if (newGrid[i]?.[j]?.state === 2) playerCount++;
                if (newGrid[i]?.[j]?.state === 3) goalCount++;
              }
            }

            // Ciclo de estados: 0 → 1 → 2 → 3 → 0
            let nextState: 0 | 1 | 2 | 3;
            if (currentState === 0) nextState = 1; // Vacío → Terreno
            else if (currentState === 1) {
              // Terreno → Jugador, pero solo si no hay jugador
              if (playerCount === 0) nextState = 2;
              else nextState = 1; // Vuelve a terreno si ya hay un jugador
            } else if (currentState === 2) {
              // Jugador → Meta, pero solo si no hay meta
              if (goalCount === 0) nextState = 3;
              else nextState = 1; // Vuelve a terreno si ya hay una meta
            } else { // currentState === 3
              // Meta → Vacío
              nextState = 0;
            }

            // Si intentamos añadir un segundo jugador o meta, mantenemos el estado actual
            if (nextState === 2 && playerCount > 0) return prev;
            if (nextState === 3 && goalCount > 0) return prev;

            newGrid[y][x] = { x, y, state: nextState };
            return newGrid;
          });
        } else if (event.button === 2) { // Clic derecho: volver a 0 (vacío)
          setGrid((prev) => {
            const newGrid = prev.map((row, i) => (i === y ? [...row] : row));
            newGrid[y][x] = { x, y, state: 0 }; // Vuelve a vacío
            return newGrid;
          });
        }
      }
    };

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCanvasClick);
    drawGrid();

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("contextmenu", handleCanvasClick);
    };
  }, [grid, rows, cols]);

  const getGridData = () => {
    return grid
      .slice(0, rows) // Limitar a las filas actuales
      .map((row) =>
        row.slice(0, cols).map((cell) => cell.state).join(" ") // Limitar a las columnas actuales
      )
      .join("\n");
  };

  // Asegurar que la cuadrícula ocupe todo el ancho del contenedor
  useEffect(() => {
    if (canvasRef.current) {
      const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = (containerWidth / cols) * rows; // Ajustar altura según filas y columnas
    }
  }, [rows, cols]);

  // Manejar cambios en filas y columnas
  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = Math.max(1, Math.min(10, parseInt(e.target.value) || 4)); // Limite entre 1 y 10
    setRows(newRows);
    setGrid((prev) => {
      const newGrid = Array(newRows).fill(Array(cols).fill({ x: 0, y: 0, state: 0 }));
      for (let y = 0; y < Math.min(newRows, prev.length); y++) {
        for (let x = 0; x < Math.min(cols, prev[y].length); x++) {
          newGrid[y][x] = prev[y][x];
        }
      }
      return newGrid;
    });
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCols = Math.max(1, Math.min(20, parseInt(e.target.value) || 8)); // Limite entre 1 y 20
    setCols(newCols);
    setGrid((prev) => {
      const newGrid = Array(rows).fill(Array(newCols).fill({ x: 0, y: 0, state: 0 }));
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < Math.min(newCols, prev[y].length); x++) {
          newGrid[y][x] = prev[y][x];
        }
      }
      return newGrid;
    });
  };

  return (
    <div>
      {/* Controles para editar tamaño de la cuadrícula */}
      <div style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px" }}>
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

      {/* Sección descriptiva */}
      <div style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px" }}>
        <p><strong>Dimensiones de la Cuadrícula:</strong> {rows} filas x {cols} columnas</p>
        <p><strong>Colores y Significados:</strong></p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ color: "white",  padding: "2px 5px", borderRadius: "3px" }}>Blanco (0): Vacío</li>
          <li style={{ color: "green",  padding: "2px 5px", borderRadius: "3px" }}>Verde (1): Terreno</li>
          <li style={{ color: "blue",  padding: "2px 5px", borderRadius: "3px" }}>Azul (2): Jugador</li>
          <li style={{ color: "red",  padding: "2px 5px", borderRadius: "3px" }}>Rojo (3): Meta</li>
        </ul>
      </div>

      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "pointer" }}
      />
    </div>
  );
};

export default Map2DView;