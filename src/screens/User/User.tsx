import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import Map3DView from "../Admin/components/Map3DView";
import * as Blockly from "blockly/core";

function User() {
  const { levelId } = useParams<{ levelId: string }>();
  const levelNumber = parseInt(levelId || "1", 10);

  const initialGridData = localStorage.getItem(`level_${levelNumber}_gridData`) || 
    "2 0 1 0 1 1 1 1\n1 1 1 1 1 0 0 1\n0 0 1 1 1 1 1 1\n0 0 0 0 0 0 1 3";
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
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const toolbox = useMemo(() => {
    if (!initialWorkspaceState || !initialWorkspaceState.blocks) return null;

    const blocks = initialWorkspaceState.blocks.keys || [];
    const movementBlocks = blocks.map((block: any) => ({
      kind: "block",
      type: block.type,
    }));

    return {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "Movimiento",
          contents: movementBlocks.length > 0 ? movementBlocks : [
            { kind: "block", type: "turn_right" },
            { kind: "block", type: "turn_left" },
            { kind: "block", type: "step_forward" },
            { kind: "block", type: "step_backward" },
            { kind: "block", type: "step_right" },
            { kind: "block", type: "step_left" },
          ],
        },
      ],
    };
  }, [initialWorkspaceState]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleExecute = async (commands: string[]) => {
    console.log("Comandos recibidos en User:", commands);
    movePlayerRef.current("reset");
    for (const command of commands) {
      console.log("Ejecutando comando:", command);
      const success = movePlayerRef.current(command);
      if (!success) {
        console.log("Comando falló o no reconocido, continuando...");
        continue;
      }
      await delay(500);
    }

    const currentWorkspaceState = workspaceRef.current
      ? Blockly.serialization.workspaces.save(workspaceRef.current)
      : null;
    const storedStateString = JSON.stringify(initialWorkspaceState?.blocks || {});
    const currentStateString = JSON.stringify(currentWorkspaceState?.blocks || {});

    if (storedStateString !== "{}" && currentWorkspaceState) {
      if (storedStateString === currentStateString) {
        alert("Felicidades, Completaste el nivel");
      } else {
        alert("Podrías hacerlo de una forma más óptima");
      }
    }
  };

  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
  }, [levelNumber]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nivel {levelNumber} - Modo Usuario</h2>
      <BlocklyWorkspace
        workspaceId={`user_level_${levelNumber}`}
        initialState={null}
        toolbox={toolbox}
        onExecute={handleExecute}
        onWorkspaceChange={(state) => {
          workspaceRef.current = state || null;
        }}
      />
      <div style={{ height: "20px" }} />
      <Map3DView
        gridData={gridData}
        gridView={false}
        onMovePlayer={(moveFn: (direction: string) => boolean) => {
          movePlayerRef.current = moveFn;
          console.log("movePlayer asignado en User");
        }}
        onFinish={() => handleExecute([])} // Notificar llegada al finish
      />
    </div>
  );
}

export default User;