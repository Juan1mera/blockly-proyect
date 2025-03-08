import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import './BlocklyView/blocklyConfig'
interface BlocklyWorkspaceProps {
  workspaceId: string;
  initialState?: any;
  toolbox?: any;
  onWorkspaceChange?: (state: any) => void;
  onExecute?: (commands: string[]) => Promise<void>;
}

export interface BlocklyWorkspaceRef {
  getWorkspaceState: () => any;
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, BlocklyWorkspaceProps>(({
  workspaceId, 
  initialState, 
  toolbox,
  onWorkspaceChange,
  onExecute 
}, ref) => {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const saveWorkspaceState = () => {
    if (!workspaceRef.current) return null;
    try {
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      return state;
    } catch (error) {
      console.error("Error saving workspace state:", error);
      return null;
    }
  };

  const loadWorkspaceState = (state: any) => {
    if (!workspaceRef.current || !state) return;
    try {
      workspaceRef.current.clear();
      Blockly.serialization.workspaces.load(state, workspaceRef.current);
    } catch (error) {
      console.error("Error loading workspace state:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    getWorkspaceState: () => saveWorkspaceState(),
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox: toolbox || {
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
      },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3 }
    });

    if (initialState) {
      loadWorkspaceState(initialState);
    }

    const changeListener = () => {
      if (workspaceId.startsWith("level_")) return; // No guardar automáticamente en Admin
      const state = saveWorkspaceState();
      onWorkspaceChange?.(state);
    };
    workspaceRef.current.addChangeListener(changeListener);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runCode = async () => {
      if (!workspaceRef.current || !onExecute) return;

      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log("Código generado:", code);
      const commands = code
        .split(';\n')
        .filter((cmd: string) => cmd.trim())
        .map((cmd: string) => cmd.replace('()', '').trim());

      console.log("Comandos procesados:", commands);

      const levelNumber = workspaceId.split('_')[2];
      if (workspaceId.startsWith("user_")) {
        const userBlocks = Blockly.serialization.workspaces.save(workspaceRef.current);
        localStorage.setItem(`UserBlocks_level_${levelNumber}`, JSON.stringify(userBlocks));
      }

      // Ejecutar reset primero
      await onExecute(["reset"]);
      await delay(500);

      // Ejecutar los comandos generados
      if (commands.length > 0) {
        await onExecute(commands);
      } else {
        console.log("No hay comandos para ejecutar.");
      }
    };

    const button = document.createElement('button');
    button.textContent = 'Run Code';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.right = '10px';
    button.onclick = runCode;
    containerRef.current.appendChild(button);

    return () => {
      workspaceRef.current?.removeChangeListener(changeListener);
      workspaceRef.current?.dispose();
      if (containerRef.current?.contains(button)) {
        containerRef.current.removeChild(button);
      }
    };
  }, [workspaceId, initialState, toolbox, onWorkspaceChange, onExecute]);

  return (
    <div style={{ position: "relative" }}>
      <div 
        ref={containerRef} 
        style={{ height: "400px", width: "100%", border: "1px solid #ccc", position: "relative" }} 
      />
    </div>
  );
});

export default BlocklyWorkspace;