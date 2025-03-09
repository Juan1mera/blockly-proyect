import React, { Component, useCallback, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../../components/customs/CustomButton";
import { saveLevelData, loadLevelData, delay } from "../../../Lib/Functions/utils";
import { BlocklyWorkspaceRef } from "../../../Lib/interfaces/LevelData";
import BlocklyWorkspace from "../../components/BlocklyView/BlocklyWorkspace";
import Map2DView from "../../components/Map2DView";
import Map3DView from "../../components/Map3DView";

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

  const initialLevelData = loadLevelData(levelNumber);
  const initialGridData = initialLevelData?.mapa || "2 0 1 0 1 1 1 1\n1 1 1 1 1 0 0 1\n0 0 1 1 1 1 1 1\n0 0 0 0 0 0 1 3";
  const initialWorkspaceState = initialLevelData?.bloquesUsados || null;

  const [gridData, setGridData] = useState<string>(initialGridData.trim());
  const [savedBlocks, setSavedBlocks] = useState<string | null>(null);
  const movePlayerRef = useRef<(direction: string) => boolean>(() => true);
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);

  const handleSave = useCallback(() => {
    const workspace = workspaceRef.current?.getWorkspaceState();
    console.log("Estado del workspace al guardar:", workspace);

    if (!workspace) {
      console.error("El workspace no está inicializado o no se pudo obtener.");
      return;
    }

    const levelData = saveLevelData(levelNumber, gridData, workspace);
    if (levelData) {
      setSavedBlocks(JSON.stringify(levelData.bloquesUsados, null, 2));
      console.log("Nivel guardado:", levelData);
    } else {
      console.error("No se pudo guardar el nivel.");
    }
  }, [gridData, levelNumber]);

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

  return (
<div
  style={{
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden"
  }}
>
  <h2 style={{ marginBottom: "10px", flexShrink: 0 }}>
    Nivel {levelNumber} - Modo Admin
  </h2>

  {/* Contenedor de Workspace y Map3DView */}
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flex: "0 1 60%", 
      overflow: "hidden",
      minHeight: "400px", 
    }}
  >
    {/* Workspace */}
    <div style={{ width: "60%", display: "flex", borderRight: "1px solid #ccc", overflow: "hidden" }}>
      <ErrorBoundary>
        <BlocklyWorkspace
          ref={workspaceRef}
          workspaceId={`level_${levelNumber}`}
          initialState={initialWorkspaceState}
          onExecute={handleExecute}
        />
      </ErrorBoundary>
    </div>

    {/* Map3DView */}
    <div style={{ width: "40%", display: "flex", overflow: "hidden" }}>
      <Map3DView
        gridData={gridData}
        gridView
        onMovePlayer={(moveFn) => {
          movePlayerRef.current = moveFn;
          console.log("movePlayer asignado en Admin");
        }}
      />
    </div>
  </div>
  <CustomButton text="Guardar" onClick={handleSave} />

  {/* Sección inferior */}
  <div
  style={{
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: "0 1 40%",
    overflow: "auto"
  }}
>
  <div style={{ height: "100%",}}>
    <Map2DView
      initialGrid={gridData}
      onGridChange={(newGridData) => setGridData(newGridData.trim())}
    />
  </div>

</div>
</div>
  );
}

export default Admin;