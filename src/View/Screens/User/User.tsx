import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import BlocklyWorkspace from "../../components/BlocklyView/BlocklyWorkspace";
import Map3DView from "../../components/Map3DView";
import { loadLevelData, saveWorkspaceState, delay } from "../../../Lib/Functions/utils";
import * as Blockly from 'blockly/core';

function User() {
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = parseInt(levelId || "1", 10);

  const initialLevelData = loadLevelData(levelNumber);
  const initialGridData = initialLevelData?.mapa || "2 0 0 0 0 0 0 0\n1 0 0 0 0 0 0 0\n1 1 1 1 1 1 1 1\n1 1 0 0 0 0 0 3";
  const initialUserBlocks = localStorage.getItem(`userBlocksUsed_level_${levelNumber}`);
  const initialWorkspaceState = initialUserBlocks ? JSON.parse(initialUserBlocks) : null;

  const [gridData] = useState<string>(initialGridData.trim());
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const movePlayerRef = useRef<(direction: string) => boolean>(() => true);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // Comparar bloques usados por el usuario y el Admin
  const compareBlocks = (userWorkspace: Blockly.WorkspaceSvg | null, adminState: any): boolean => {
    if (!userWorkspace || !adminState) return false;

    const userState = saveWorkspaceState(userWorkspace);
    console.log("Estado del usuario:", userState);
    console.log("Estado del Admin:", adminState);

    if (!userState?.blocks || !adminState?.blocks) return false;

    const userBlocks = Array.isArray(userState.blocks) ? userState.blocks : [userState.blocks];
    const adminBlocks = Array.isArray(adminState.blocks) ? adminState.blocks : [adminState.blocks];

    if (userBlocks.length !== adminBlocks.length) return false;

    return userBlocks.every((userBlock: any, index: number) => {
      const adminBlock = adminBlocks[index];
      return (
        userBlock.type === adminBlock.type &&
        JSON.stringify(userBlock.inputs || {}) === JSON.stringify(adminBlock.inputs || {}) &&
        JSON.stringify(userBlock.fields || {}) === JSON.stringify(adminBlock.fields || {})
      );
    });
  };

  const handleExecute = async (commands: string[]) => {
    console.log("Comandos recibidos en User:", commands);

    // Guardar los bloques del usuario al ejecutar
    if (workspaceRef.current) {
      const userBlocks = saveWorkspaceState(workspaceRef.current);
      const userLevelData = {
        numeroNivel: levelNumber,
        mapa: gridData,
        bloquesUsados: userBlocks,
        cantidadBloques: workspaceRef.current.getAllBlocks(false).length, // Conteo directo
      };
      localStorage.setItem(`userBlocksUsed_level_${levelNumber}`, JSON.stringify(userBlocks));
      localStorage.setItem(`userLevel_${levelNumber}`, JSON.stringify(userLevelData));
      console.log("Bloques del usuario guardados:", userLevelData);
    } else {
      console.error("Workspace no inicializado al intentar guardar.");
    }

    for (const command of commands) {
      console.log("Ejecutando comando:", command);
      if (command === "finish") {
        const adminStateRaw = localStorage.getItem(`level_${levelNumber}_workspaceState`);
        if (!adminStateRaw) {
          setModalMessage("Completado, pero no hay solución óptima guardada");
          return;
        }

        const adminState = JSON.parse(adminStateRaw);
        const areBlocksEqual = compareBlocks(workspaceRef.current, adminState);

        if (areBlocksEqual) {
          setModalMessage("Nivel Completado Correctamente");
        } else {
          setModalMessage("Completado, pero la solución no es la óptima");
        }
        return;
      }

      const success = movePlayerRef.current(command);
      if (!success) {
        console.log("Comando falló, deteniendo ejecución...");
        break;
      }
      await delay(500);
    }
  };

  return (
    <div style={{ padding: "10px", height: "100vh", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginBottom: "10px" }}>Nivel {levelNumber} - Modo Usuario</h2>
      <div style={{ 
        display: "flex", 
        flex: 1, 
        height: "calc(100% - 50px)" // Restar altura del título y márgenes
      }}>
        {/* Workspace a la izquierda, 60% del ancho */}
        <div style={{ 
          width: "60%", 
          height: "100%", 
          borderRight: "1px solid #ccc",
          overflow: "hidden" // Evitar desbordamiento
        }}>
          <BlocklyWorkspace
            ref={(node) => {
              workspaceRef.current = node?.getWorkspaceState() || null;
            }}
            workspaceId={`user_level_${levelNumber}`}
            initialState={initialWorkspaceState}
            onExecute={handleExecute}
            onWorkspaceReady={(workspace) => {
              workspaceRef.current = workspace;
              console.log("Workspace listo:", workspace);
            }}
          />
        </div>

        {/* Map3DView a la derecha, 40% del ancho */}
        <div style={{ 
          width: "40%", 
          height: "100%", 
          overflow: "hidden" // Evitar desbordamiento
        }}>
          <Map3DView
            gridData={gridData}
            gridView={false}
            onMovePlayer={(moveFn) => {
              movePlayerRef.current = moveFn;
            }}
            onFinish={() => handleExecute(["finish"])}
          />
        </div>
      </div>

      {/* Modal */}
      {modalMessage && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "black",
          color: "white",
          padding: "20px",
          border: "2px solid white",
          borderRadius: "5px",
          zIndex: 1000
        }}>
          <h2>{modalMessage}</h2>
          <button onClick={() => setModalMessage(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default User;