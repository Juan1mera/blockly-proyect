import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { pythonGenerator } from "blockly/python";
import { phpGenerator } from "blockly/php";
import { luaGenerator } from "blockly/lua";
import { dartGenerator } from "blockly/dart";

const COLORS: [string, string][] = [
  ["Rojo", "red"],
  ["Azul", "blue"],
  ["Verde", "green"],
  ["Amarillo", "yellow"],
];

export const addMovementBlocks = () => {
  // Bloque para crear un objeto 2D
  if (!Blockly.Blocks["create_object"]) {
    Blockly.Blocks["create_object"] = {
      init() {
        this.appendDummyInput()
          .appendField("Crear objeto 2D ID:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID")
          .appendField("en x:")
          .appendField(new Blockly.FieldNumber(0, 0, 14), "X")
          .appendField("y:")
          .appendField(new Blockly.FieldNumber(0, 0, 14), "Y")
          .appendField("color:")
          .appendField(new Blockly.FieldDropdown(COLORS), "COLOR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["create_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const color = block.getFieldValue("COLOR");
    return `createObject("${id}", ${x}, ${y}, "${color}");\n`;
  };

  pythonGenerator.forBlock["create_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const color = block.getFieldValue("COLOR");
    return `createObject("${id}", ${x}, ${y}, "${color}")\n`;
  };

  phpGenerator.forBlock["create_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const color = block.getFieldValue("COLOR");
    return `createObject("${id}", ${x}, ${y}, "${color}");\n`;
  };

  luaGenerator.forBlock["create_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const color = block.getFieldValue("COLOR");
    return `createObject("${id}", ${x}, ${y}, "${color}")\n`;
  };

  dartGenerator.forBlock["create_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const color = block.getFieldValue("COLOR");
    return `createObject("${id}", ${x}, ${y}, "${color}");\n`;
  };

  // Bloque para mover a la derecha (2D)
  if (!Blockly.Blocks["move_right"]) {
    Blockly.Blocks["move_right"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover a la derecha 2D objeto:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveRight("${id}");\n`;
  };

  pythonGenerator.forBlock["move_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveRight("${id}")\n`;
  };

  phpGenerator.forBlock["move_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveRight("${id}");\n`;
  };

  luaGenerator.forBlock["move_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveRight("${id}")\n`;
  };

  dartGenerator.forBlock["move_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveRight("${id}");\n`;
  };

  // Bloque para mover a la izquierda (2D)
  if (!Blockly.Blocks["move_left"]) {
    Blockly.Blocks["move_left"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover a la izquierda 2D objeto:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveLeft("${id}");\n`;
  };

  pythonGenerator.forBlock["move_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveLeft("${id}")\n`;
  };

  phpGenerator.forBlock["move_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveLeft("${id}");\n`;
  };

  luaGenerator.forBlock["move_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveLeft("${id}")\n`;
  };

  dartGenerator.forBlock["move_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveLeft("${id}");\n`;
  };

  // Bloque para mover arriba (2D)
  if (!Blockly.Blocks["move_up"]) {
    Blockly.Blocks["move_up"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover arriba 2D objeto:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveUp("${id}");\n`;
  };

  pythonGenerator.forBlock["move_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveUp("${id}")\n`;
  };

  phpGenerator.forBlock["move_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveUp("${id}");\n`;
  };

  luaGenerator.forBlock["move_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveUp("${id}")\n`;
  };

  dartGenerator.forBlock["move_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveUp("${id}");\n`;
  };

  // Bloque para mover abajo (2D)
  if (!Blockly.Blocks["move_down"]) {
    Blockly.Blocks["move_down"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover abajo 2D objeto:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["move_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveDown("${id}");\n`;
  };

  pythonGenerator.forBlock["move_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveDown("${id}")\n`;
  };

  phpGenerator.forBlock["move_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveDown("${id}");\n`;
  };

  luaGenerator.forBlock["move_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveDown("${id}")\n`;
  };

  dartGenerator.forBlock["move_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `moveDown("${id}");\n`;
  };

  // Bloque condicional: Si el objeto choca con otro (2D)
  if (!Blockly.Blocks["if_collides"]) {
    Blockly.Blocks["if_collides"] = {
      init() {
        this.appendDummyInput()
          .appendField("Si objeto 2D:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID1")
          .appendField("choca con:")
          .appendField(new Blockly.FieldTextInput("obj2"), "ID2");
        this.appendStatementInput("DO").setCheck(null).appendField("hacer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
      },
    };
  }

  javascriptGenerator.forBlock["if_collides"] = function (block: Blockly.Block) {
    const id1 = block.getFieldValue("ID1");
    const id2 = block.getFieldValue("ID2");
    const branch = javascriptGenerator.statementToCode(block, "DO");
    return `if (collides("${id1}", "${id2}")) {\n${branch}}\n`;
  };

  pythonGenerator.forBlock["if_collides"] = function (block: Blockly.Block) {
    const id1 = block.getFieldValue("ID1");
    const id2 = block.getFieldValue("ID2");
    const branch = pythonGenerator.statementToCode(block, "DO").trim();
    return `if collides("${id1}", "${id2}"):\n${branch}\n`;
  };

  phpGenerator.forBlock["if_collides"] = function (block: Blockly.Block) {
    const id1 = block.getFieldValue("ID1");
    const id2 = block.getFieldValue("ID2");
    const branch = phpGenerator.statementToCode(block, "DO").trim();
    return `if (collides("${id1}", "${id2}")) {\n${branch}\n}\n`;
  };

  luaGenerator.forBlock["if_collides"] = function (block: Blockly.Block) {
    const id1 = block.getFieldValue("ID1");
    const id2 = block.getFieldValue("ID2");
    const branch = luaGenerator.statementToCode(block, "DO").trim();
    return `if collides("${id1}", "${id2}") then\n${branch}\nend\n`;
  };

  dartGenerator.forBlock["if_collides"] = function (block: Blockly.Block) {
    const id1 = block.getFieldValue("ID1");
    const id2 = block.getFieldValue("ID2");
    const branch = dartGenerator.statementToCode(block, "DO").trim();
    return `if (collides("${id1}", "${id2}")) {\n${branch}\n}\n`;
  };

  // Bloque condicional: Si el objeto toca un borde (2D)
  if (!Blockly.Blocks["if_touches_edge"]) {
    Blockly.Blocks["if_touches_edge"] = {
      init() {
        this.appendDummyInput()
          .appendField("Si objeto 2D:")
          .appendField(new Blockly.FieldTextInput("obj1"), "ID")
          .appendField("toca un borde");
        this.appendStatementInput("DO").setCheck(null).appendField("hacer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
      },
    };
  }

  javascriptGenerator.forBlock["if_touches_edge"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const branch = javascriptGenerator.statementToCode(block, "DO");
    return `if (touchesEdge("${id}")) {\n${branch}}\n`;
  };

  pythonGenerator.forBlock["if_touches_edge"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const branch = pythonGenerator.statementToCode(block, "DO").trim();
    return `if touchesEdge("${id}"):\n${branch}\n`;
  };

  phpGenerator.forBlock["if_touches_edge"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const branch = phpGenerator.statementToCode(block, "DO").trim();
    return `if (touchesEdge("${id}")) {\n${branch}\n}\n`;
  };

  luaGenerator.forBlock["if_touches_edge"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const branch = luaGenerator.statementToCode(block, "DO").trim();
    return `if touchesEdge("${id}") then\n${branch}\nend\n`;
  };

  dartGenerator.forBlock["if_touches_edge"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const branch = dartGenerator.statementToCode(block, "DO").trim();
    return `if (touchesEdge("${id}")) {\n${branch}\n}\n`;
  };

  // Bloque para crear un objeto 3D
  if (!Blockly.Blocks["create_3d_object"]) {
    Blockly.Blocks["create_3d_object"] = {
      init() {
        this.appendDummyInput()
          .appendField("Crear objeto 3D ID:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID")
          .appendField("en x:")
          .appendField(new Blockly.FieldNumber(0, 0, 5), "X") // Límite 6x6: 0-5
          .appendField("y:")
          .appendField(new Blockly.FieldNumber(0, 0, 5), "Y")
          .appendField("z:")
          .appendField(new Blockly.FieldNumber(0, 0, 5), "Z")
          .appendField("color:")
          .appendField(new Blockly.FieldDropdown(COLORS), "COLOR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160); // Diferente color para 3D
      },
    };
  }

  javascriptGenerator.forBlock["create_3d_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const z = block.getFieldValue("Z");
    const color = block.getFieldValue("COLOR");
    return `create3DObject("${id}", ${x}, ${y}, ${z}, "${color}");\n`;
  };

  pythonGenerator.forBlock["create_3d_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const z = block.getFieldValue("Z");
    const color = block.getFieldValue("COLOR");
    return `create3DObject("${id}", ${x}, ${y}, ${z}, "${color}")\n`;
  };

  phpGenerator.forBlock["create_3d_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const z = block.getFieldValue("Z");
    const color = block.getFieldValue("COLOR");
    return `create3DObject("${id}", ${x}, ${y}, ${z}, "${color}");\n`;
  };

  luaGenerator.forBlock["create_3d_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const z = block.getFieldValue("Z");
    const color = block.getFieldValue("COLOR");
    return `create3DObject("${id}", ${x}, ${y}, ${z}, "${color}")\n`;
  };

  dartGenerator.forBlock["create_3d_object"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    const x = block.getFieldValue("X");
    const y = block.getFieldValue("Y");
    const z = block.getFieldValue("Z");
    const color = block.getFieldValue("COLOR");
    return `create3DObject("${id}", ${x}, ${y}, ${z}, "${color}");\n`;
  };

  // Bloque para mover a la derecha (3D)
  if (!Blockly.Blocks["move_3d_right"]) {
    Blockly.Blocks["move_3d_right"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover a la derecha 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DRight("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DRight("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DRight("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DRight("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_right"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DRight("${id}");\n`;
  };

  // Bloque para mover a la izquierda (3D)
  if (!Blockly.Blocks["move_3d_left"]) {
    Blockly.Blocks["move_3d_left"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover a la izquierda 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DLeft("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DLeft("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DLeft("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DLeft("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_left"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DLeft("${id}");\n`;
  };

  // Bloque para mover arriba (3D)
  if (!Blockly.Blocks["move_3d_up"]) {
    Blockly.Blocks["move_3d_up"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover arriba 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DUp("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DUp("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DUp("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DUp("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_up"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DUp("${id}");\n`;
  };

  // Bloque para mover abajo (3D)
  if (!Blockly.Blocks["move_3d_down"]) {
    Blockly.Blocks["move_3d_down"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover abajo 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DDown("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DDown("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DDown("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DDown("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_down"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DDown("${id}");\n`;
  };

  // Bloque para mover adelante (3D)
  if (!Blockly.Blocks["move_3d_forward"]) {
    Blockly.Blocks["move_3d_forward"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover adelante 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_forward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DForward("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_forward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DForward("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_forward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DForward("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_forward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DForward("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_forward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DForward("${id}");\n`;
  };

  // Bloque para mover atrás (3D)
  if (!Blockly.Blocks["move_3d_backward"]) {
    Blockly.Blocks["move_3d_backward"] = {
      init() {
        this.appendDummyInput()
          .appendField("Mover atrás 3D objeto:")
          .appendField(new Blockly.FieldTextInput("cube1"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["move_3d_backward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DBackward("${id}");\n`;
  };

  pythonGenerator.forBlock["move_3d_backward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DBackward("${id}")\n`;
  };

  phpGenerator.forBlock["move_3d_backward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DBackward("${id}");\n`;
  };

  luaGenerator.forBlock["move_3d_backward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DBackward("${id}")\n`;
  };

  dartGenerator.forBlock["move_3d_backward"] = function (block: Blockly.Block) {
    const id = block.getFieldValue("ID");
    return `move3DBackward("${id}");\n`;
  };
};

export const movementToolbox = `
  <xml>
    <block type="create_object"></block>
    <block type="move_right"></block>
    <block type="move_left"></block>
    <block type="move_up"></block>
    <block type="move_down"></block>
    <block type="if_collides"></block>
    <block type="if_touches_edge"></block>
    <block type="create_3d_object"></block>
    <block type="move_3d_right"></block>
    <block type="move_3d_left"></block>
    <block type="move_3d_up"></block>
    <block type="move_3d_down"></block>
    <block type="move_3d_forward"></block>
    <block type="move_3d_backward"></block>
  </xml>
`;