import * as Blockly from "blockly";
import { javascriptGenerator, } from "blockly/javascript";

export const addMovementBlocks = () => {
  // Bloque para mover a la derecha
  if (!Blockly.Blocks["move_right"]) {
    Blockly.Blocks["move_right"] = {
      init() {
        this.appendDummyInput().appendField("Mover a la derecha");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120); // Verde para movimientos
      },
    };
  }

  javascriptGenerator.forBlock["move_right"] = function () {
    return "moveRight();\n";
  };

  // Bloque para mover a la izquierda
  if (!Blockly.Blocks["move_left"]) {
    Blockly.Blocks["move_left"] = {
      init() {
        this.appendDummyInput().appendField("Mover a la izquierda");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_left"] = function () {
    return "moveLeft();\n";
  };

  // Bloque para mover arriba
  if (!Blockly.Blocks["move_up"]) {
    Blockly.Blocks["move_up"] = {
      init() {
        this.appendDummyInput().appendField("Mover arriba");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_up"] = function () {
    return "moveUp();\n";
  };

  // Bloque para mover abajo
  if (!Blockly.Blocks["move_down"]) {
    Blockly.Blocks["move_down"] = {
      init() {
        this.appendDummyInput().appendField("Mover abajo");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_down"] = function () {
    return "moveDown();\n";
  };
};

export const movementToolbox = `
  <xml>
    <block type="move_right"></block>
    <block type="move_left"></block>
    <block type="move_up"></block>
    <block type="move_down"></block>
  </xml>
`;