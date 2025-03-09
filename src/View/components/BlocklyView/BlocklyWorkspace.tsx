import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { BlocklyWorkspaceProps, BlocklyWorkspaceRef } from '../../../Lib/interfaces/LevelData';
import { defaultToolbox } from '../../../Lib/constants/toolboxConfig';
import { saveWorkspaceState, loadWorkspaceState, delay } from '../../../Lib/Functions/utils';
import './blocklyConfig';

interface ExtendedBlocklyWorkspaceProps extends BlocklyWorkspaceProps {
  onWorkspaceReady?: (workspace: Blockly.WorkspaceSvg) => void;
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, ExtendedBlocklyWorkspaceProps>(({
  workspaceId, 
  initialState, 
  toolbox = defaultToolbox,
  onWorkspaceChange,
  onExecute,
  onWorkspaceReady,
}, ref) => {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getWorkspaceState: () => workspaceRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Bloques registrados:", Object.keys(Blockly.Blocks));

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox,
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3 }
    });

    if (initialState) {
      console.log("Cargando estado inicial:", initialState);
      loadWorkspaceState(workspaceRef.current, initialState);
    }

    if (onWorkspaceReady && workspaceRef.current) {
      onWorkspaceReady(workspaceRef.current);
    }

    const changeListener = () => {
      if (workspaceId.startsWith("level_")) return;
      const state = saveWorkspaceState(workspaceRef.current);
      onWorkspaceChange?.(state);
    };
    workspaceRef.current.addChangeListener(changeListener);

    const runCode = async () => {
      if (!workspaceRef.current || !onExecute) return;

      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log("Código generado:", code);
      const commands = code
        .split(';\n')
        .filter((cmd: string) => cmd.trim())
        .map((cmd: string) => cmd.replace('()', '').trim());

      console.log("Comandos procesados:", commands);

      const levelNumber = parseInt(workspaceId.split('_')[2] || "1", 10);
      if (workspaceId.startsWith("user_")) {
        const userBlocks = saveWorkspaceState(workspaceRef.current);
        localStorage.setItem(`userBlocksUsed_level_${levelNumber}`, JSON.stringify(userBlocks));
      }

      await onExecute(["reset"]);
      await delay(500);

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
  }, [workspaceId, initialState, toolbox, onWorkspaceChange, onExecute, onWorkspaceReady]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div 
        ref={containerRef} 
        style={{ height: "100%", width: "100%", position: "relative" }} 
      />
    </div>
  );
});

export default BlocklyWorkspace;