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
  const [grid, setGrid] = useState<Cell[][]>(() => {
    if (initialGrid) {
      const rows = initialGrid.trim().split("\n");
      return rows.map((row, y) =>
        row.trim().split(" ").map((state, x) => ({
          x,
          y,
          state: parseInt(state) as 0 | 1 | 2 | 3,
        }))
      );
    }
    return Array(4).fill(Array(8).fill({ x: 0, y: 0, state: 0 }));
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

    const cellWidth = canvas.width / 8; // 8 columnas
    const cellHeight = canvas.height / 4; // 4 filas

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 8; x++) {
          ctx.strokeStyle = "black";
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

          const cell = grid[y][x];
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

      if (x >= 0 && x < 8 && y >= 0 && y < 4) {
        if (event.button === 0) { // Clic izquierdo: ciclo de estados
          setGrid((prev) => {
            const newGrid = prev.map((row) => [...row]);
            const currentState = newGrid[y][x].state;

            // Contar jugador y meta actuales
            let playerCount = 0;
            let goalCount = 0;
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 8; j++) {
                if (newGrid[i][j].state === 2) playerCount++;
                if (newGrid[i][j].state === 3) goalCount++;
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
            const newGrid = prev.map((row) => [...row]);
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
  }, [grid]);

  const getGridData = () => {
    return grid
      .map((row) =>
        row.map((cell) => cell.state).join(" ")
      )
      .join("\n");
  };

  // Asegurar que la cuadrícula ocupe todo el ancho del contenedor
  useEffect(() => {
    if (canvasRef.current) {
      const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = (containerWidth / 8) * 4; // Mantener proporción 8x4
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "pointer" }}
      />
    </div>
  );
};

export default Map2DView;