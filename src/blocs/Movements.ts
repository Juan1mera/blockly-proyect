import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { pythonGenerator} from "blockly/python";
import { phpGenerator,} from "blockly/php";
import { luaGenerator,} from "blockly/lua";
import { dartGenerator} from "blockly/dart";

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

  pythonGenerator.forBlock["move_right"] = function () {
    return "moveRight()\n"; // Python genera una llamada a función
  };

  phpGenerator.forBlock["move_right"] = function () {
    return "moveRight();\n"; // PHP genera una llamada a función
  };

  luaGenerator.forBlock["move_right"] = function () {
    return "moveRight()\n"; // Lua genera una llamada a función
  };

  dartGenerator.forBlock["move_right"] = function () {
    return "moveRight();\n"; // Dart genera una llamada a función
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

  pythonGenerator.forBlock["move_left"] = function () {
    return "moveLeft()\n";
  };

  phpGenerator.forBlock["move_left"] = function () {
    return "moveLeft();\n";
  };

  luaGenerator.forBlock["move_left"] = function () {
    return "moveLeft()\n";
  };

  dartGenerator.forBlock["move_left"] = function () {
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

  pythonGenerator.forBlock["move_up"] = function () {
    return "moveUp()\n";
  };

  phpGenerator.forBlock["move_up"] = function () {
    return "moveUp();\n";
  };

  luaGenerator.forBlock["move_up"] = function () {
    return "moveUp()\n";
  };

  dartGenerator.forBlock["move_up"] = function () {
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

  pythonGenerator.forBlock["move_down"] = function () {
    return "moveDown()\n";
  };

  phpGenerator.forBlock["move_down"] = function () {
    return "moveDown();\n";
  };

  luaGenerator.forBlock["move_down"] = function () {
    return "moveDown()\n";
  };

  dartGenerator.forBlock["move_down"] = function () {
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