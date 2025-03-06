import React, { useEffect, useRef } from "react";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';

// Definir nuevos bloques
Blockly.Blocks['turn_right'] = {
  init: function() {
    this.appendDummyInput().appendField("Girar a la derecha");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
Blockly.Blocks['turn_left'] = {
  init: function() {
    this.appendDummyInput().appendField("Girar a la izquierda");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
Blockly.Blocks['step_forward'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso al frente");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
Blockly.Blocks['step_backward'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso atrás");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
Blockly.Blocks['step_right'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso a la derecha");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
Blockly.Blocks['step_left'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso a la izquierda");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

// Generadores de JavaScript para los nuevos bloques
javascriptGenerator.forBlock['turn_right'] = function() { return 'turnRight();\n'; };
javascriptGenerator.forBlock['turn_left'] = function() { return 'turnLeft();\n'; };
javascriptGenerator.forBlock['step_forward'] = function() { return 'stepForward();\n'; };
javascriptGenerator.forBlock['step_backward'] = function() { return 'stepBackward();\n'; };
javascriptGenerator.forBlock['step_right'] = function() { return 'stepRight();\n'; };
javascriptGenerator.forBlock['step_left'] = function() { return 'stepLeft();\n'; };

interface BlocklyWorkspaceProps {
  workspaceId: string;
  initialState?: any;
  toolbox?: any;
  onWorkspaceChange?: (state: any) => void;
  onExecute?: (commands: string[]) => void;
}

const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = ({ 
  workspaceId, 
  initialState, 
  onWorkspaceChange,
  onExecute 
}) => {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const saveWorkspaceState = () => {
    if (!workspaceRef.current) return null;
    try {
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      onWorkspaceChange?.(state);
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

  useEffect(() => {
    if (!containerRef.current) return;

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Logic",
            contents: [
              { kind: "block", type: "controls_if" },
              { kind: "block", type: "logic_compare" }
            ]
          },
          {
            kind: "category",
            name: "Math",
            contents: [
              { kind: "block", type: "math_number" },
              { kind: "block", type: "math_arithmetic" }
            ]
          },
          {
            kind: "category",
            name: "Movement",
            contents: [
              { kind: "block", type: "turn_right" },
              { kind: "block", type: "turn_left" },
              { kind: "block", type: "step_forward" },
              { kind: "block", type: "step_backward" },
              { kind: "block", type: "step_right" },
              { kind: "block", type: "step_left" }
            ]
          },
          {
            kind: "category",
            name: "Variables",
            custom: "VARIABLE"
          }
        ]
      },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3 }
    });

    if (initialState) {
      loadWorkspaceState(initialState);
    }

    const changeListener = () => saveWorkspaceState();
    workspaceRef.current.addChangeListener(changeListener);

    const runCode = () => {
      console.log("Ejecutando código...");
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current!);
      const commands = code
        .split(';\n')
        .filter((cmd: string) => cmd.trim())
        .map((cmd: string) => cmd.replace('()', ''));
      console.log("Comandos generados:", commands);
      onExecute?.(commands);
      console.log("Código ejecutado:", code);
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
  }, [workspaceId, initialState, onWorkspaceChange, onExecute]);

  return (
    <div 
      ref={containerRef} 
      style={{ height: "400px", width: "100%", border: "1px solid #ccc", position: "relative" }} 
    />
  );
};

export default BlocklyWorkspace;