import React, { Component, useCallback, useMemo, useState, useRef } from "react";
import BlocklyWorkspace, { BlocklyWorkspaceRef } from "../../components/BlocklyWorkspace";
import CustomButton from "../../components/customs/CustomButton";
import Map2DView from "./components/Map2DView";
import Map3DView from "./components/Map3DView";
import { useParams } from "react-router-dom";

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Algo salió mal. Por favor, recarga la página o intenta de nuevo.</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Recargar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Admin() {
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = parseInt(levelId || "1", 10);

  const initialGridData = localStorage.getItem(`level_${levelNumber}_gridData`) || 
    "2 0 1 0 1 1 1 1\n1 1 1 1 1 0 0 1\n0 0 1 1 1 1 1 1\n0 0 0 0 0 0 1 3";
  const [gridData, setGridData] = useState<string>(initialGridData.trim());
  const movePlayerRef = useRef<(direction: string) => boolean>(() => true);
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);

  const initialWorkspaceState = useMemo(() => {
    const storedState = localStorage.getItem(`level_${levelNumber}_workspaceState`);
    try {
      return storedState ? JSON.parse(storedState) : null;
    } catch (error) {
      console.warn("Error parsing workspace state:", error);
      return null;
    }
  }, [levelNumber]);

  const [savedBlocks, setSavedBlocks] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    const currentWorkspaceState = workspaceRef.current?.getWorkspaceState();
    if (!currentWorkspaceState) {
      console.error("No se pudo obtener el estado actual del workspace");
      return;
    }
    const levelData = { nivel: levelNumber, mapa: gridData, bloques: currentWorkspaceState };
    localStorage.setItem(`level_${levelNumber}_gridData`, gridData);
    localStorage.setItem(`level_${levelNumber}_workspaceState`, JSON.stringify(currentWorkspaceState));
    localStorage.setItem(`level_${levelNumber}`, JSON.stringify(levelData));
    setSavedBlocks(JSON.stringify(currentWorkspaceState, null, 2));
    console.log("Nivel guardado:", levelData);
  }, [gridData, levelNumber]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleExecute = useCallback(async (commands: string[]) => {
    console.log("Comandos recibidos en Admin:", commands);
    for (const command of commands) {
      console.log("Ejecutando comando:", command);
      const success = movePlayerRef.current(command);
      if (!success) {
        console.log("Comando falló, deteniendo ejecución...");
        break;
      }
      await delay(500);
    }
  }, []);

  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Movimiento",
        contents: [
          { kind: "block", type: "turn_right" },
          { kind: "block", type: "turn_left" },
          { kind: "block", type: "step_forward" },
          { kind: "block", type: "step_backward" },
          { kind: "block", type: "step_right" },
          { kind: "block", type: "step_left" },
        ],
      },
      {
        kind: "category",
        name: "Bucles",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
            inputs: {
              TIMES: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 5 },
                },
              },
            },
          },
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <ErrorBoundary>
        <BlocklyWorkspace 
          ref={workspaceRef}
          workspaceId={`level_${levelNumber}`}
          initialState={initialWorkspaceState}
          toolbox={toolbox}
          onExecute={handleExecute}
        />
      </ErrorBoundary>
      <Map3DView 
        gridData={gridData} 
        gridView 
        onMovePlayer={(moveFn: (direction: string) => boolean) => { 
          movePlayerRef.current = moveFn; 
          console.log("movePlayer asignado en Admin");
        }}
      />
      <div style={{ height: "20px" }} />
      
      <CustomButton text="Guardar" onClick={handleSave} />
      
      <div style={{ height: "20px" }} />
      
      <Map2DView
        initialGrid={gridData}
        onGridChange={(newGridData) => setGridData(newGridData.trim())}
      />
      
      <div style={{ marginTop: "20px" }}>
        <h3>Datos de la Cuadrícula (Nivel {levelNumber})</h3>
        <pre>{gridData}</pre>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Bloques Guardados (Nivel {levelNumber})</h3>
        <pre>{savedBlocks || "No hay bloques guardados aún."}</pre>
      </div>
      
      <div style={{ height: "200px" }} />
    </div>
  );
}

export default Admin;