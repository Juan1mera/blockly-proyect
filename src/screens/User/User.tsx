import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import Map3DView from "../Admin/components/Map3DView";
import * as Blockly from "blockly/core";

function User() {
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = parseInt(levelId || "1", 10);

  const initialGridData = localStorage.getItem(`level_${levelNumber}_gridData`) || 
    "2 0 0 0 0 0 0 0\n1 0 0 0 0 0 0 0\n1 1 1 1 1 1 1 1\n1 1 0 0 0 0 0 3";
  const [gridData] = useState<string>(initialGridData.trim());

  const initialWorkspaceState = useMemo(() => {
    const storedState = localStorage.getItem(`level_${levelNumber}_workspaceState`);
    try {
      return storedState ? JSON.parse(storedState) : null;
    } catch (error) {
      console.warn("Error parsing workspace state:", error);
      return null;
    }
  }, [levelNumber]);

  const movePlayerRef = useRef<(direction: string) => boolean>(() => true);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const toolbox = useMemo(() => {
    return {
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
  }, []);

  const getBlockTypes = (blocks: any): string[] => {
    if (!blocks || !blocks.blocks) return [];
    const blockList = Array.isArray(blocks.blocks) ? blocks.blocks : [blocks.blocks];
    return blockList.map((block: any) => block.type).sort();
  };

  const compareWorkspaceStates = (userState: any, adminState: any): boolean => {
    if (!userState || !adminState) return false;
    const userBlocks = getBlockTypes(userState);
    const adminBlocks = getBlockTypes(adminState);
    return userBlocks.length === adminBlocks.length && 
           userBlocks.every((type: string, index: number) => type === adminBlocks[index]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleExecute = async (commands: string[]) => {
    console.log("Comandos recibidos en User:", commands);
    for (const command of commands) {
      console.log("Ejecutando comando:", command);
      if (command === "finish") {
        const userBlocks = localStorage.getItem(`UserBlocks_level_${levelNumber}`);
        const adminBlocks = localStorage.getItem(`level_${levelNumber}_workspaceState`);
        
        if (userBlocks && adminBlocks) {
          const userState = JSON.parse(userBlocks);
          const adminState = JSON.parse(adminBlocks);
          const areBlocksEqual = compareWorkspaceStates(userState, adminState);
          
          if (areBlocksEqual) {
            setModalMessage("Nivel Completado Correctamente");
          } else {
            setModalMessage("Completado, pero la solución no es la óptima");
          }
        } else {
          setModalMessage("Completado, pero no hay solución óptima guardada");
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
    <div style={{ padding: "20px" }}>
      <h2>Nivel {levelNumber} - Modo Usuario</h2>
      <BlocklyWorkspace
        workspaceId={`user_level_${levelNumber}`}
        initialState={null}
        toolbox={toolbox}
        onExecute={handleExecute}
      />
      <div style={{ height: "20px" }} />
      <Map3DView
        gridData={gridData}
        gridView={false}
        onMovePlayer={(moveFn) => {
          movePlayerRef.current = moveFn;
        }}
        onFinish={() => handleExecute(["finish"])}
      />
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