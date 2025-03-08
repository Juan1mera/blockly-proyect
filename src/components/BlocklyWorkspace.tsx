import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';

// Definición de bloques de movimiento
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

// Definición del bloque de repetición
Blockly.Blocks['controls_repeat_ext'] = {
  init: function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("repetir");
    this.appendStatementInput("DO")
        .appendField("veces");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setInputsInline(true);
  }
};

// Generadores de código
javascriptGenerator.forBlock['turn_right'] = function() { return 'turnRight();\n'; };
javascriptGenerator.forBlock['turn_left'] = function() { return 'turnLeft();\n'; };
javascriptGenerator.forBlock['step_forward'] = function() { return 'stepForward();\n'; };
javascriptGenerator.forBlock['step_backward'] = function() { return 'stepBackward();\n'; };
javascriptGenerator.forBlock['step_right'] = function() { return 'stepRight();\n'; };
javascriptGenerator.forBlock['step_left'] = function() { return 'stepLeft();\n'; };
javascriptGenerator.forBlock['controls_repeat_ext'] = function(block) {
  const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '5';
  const code = javascriptGenerator.statementToCode(block, 'DO');
  let repeatedCode = '';
  for (let i = 0; i < parseInt(times); i++) {
    repeatedCode += code;
  }
  return repeatedCode;
};

interface BlocklyWorkspaceProps {
  workspaceId: string;
  initialState?: any;
  toolbox?: any;
  onWorkspaceChange?: (state: any) => void;
  onExecute?: (commands: string[]) => void;
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
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current!);
      const commands = code
        .split(';\n')
        .filter((cmd: string) => cmd.trim())
        .map((cmd: string) => cmd.replace('()', '').trim()); // Limpiar espacios

      const levelNumber = workspaceId.split('_')[2];
      if (workspaceId.startsWith("user_")) {
        const userBlocks = Blockly.serialization.workspaces.save(workspaceRef.current!);
        localStorage.setItem(`UserBlocks_level_${levelNumber}`, JSON.stringify(userBlocks));
      }

      const resetSuccess = onExecute?.(["reset"]);
      if (!resetSuccess) return;
      await delay(500);

      await onExecute?.(commands);
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