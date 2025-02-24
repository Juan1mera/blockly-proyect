import * as Blockly from "blockly/core";
import { javascriptGenerator, Order as JavascriptOrder } from "blockly/javascript";
import { phpGenerator, Order as PhpOrder } from "blockly/php";
import { pythonGenerator, Order as PythonOrder } from "blockly/python";
import { luaGenerator, Order as LuaOrder } from "blockly/lua";
import { dartGenerator, Order as DartOrder } from "blockly/dart";

export const addListBlocks = () => {
  if (!Blockly.Blocks["create_list"]) {
    Blockly.Blocks["create_list"] = {
      init() {
        this.appendDummyInput().appendField("Crear lista con");
        this.appendValueInput("ITEM1").setCheck(null);
        this.appendValueInput("ITEM2").setCheck(null);
        this.setOutput(true, "Array");
        this.setColour(260);
      },
    };
  }

  // JavaScript
  javascriptGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = javascriptGenerator.valueToCode(block, "ITEM1", JavascriptOrder.ATOMIC) || "null";
    const item2 = javascriptGenerator.valueToCode(block, "ITEM2", JavascriptOrder.ATOMIC) || "null";
    return [`[${item1}, ${item2}]`, JavascriptOrder.ATOMIC];
  };

  // PHP
  phpGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = phpGenerator.valueToCode(block, "ITEM1", PhpOrder.ATOMIC) || "null";
    const item2 = phpGenerator.valueToCode(block, "ITEM2", PhpOrder.ATOMIC) || "null";
    return [`array(${item1}, ${item2})`, PhpOrder.ATOMIC];
  };

  // Python
  pythonGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = pythonGenerator.valueToCode(block, "ITEM1", PythonOrder.ATOMIC) || "None";
    const item2 = pythonGenerator.valueToCode(block, "ITEM2", PythonOrder.ATOMIC) || "None";
    return [`[${item1}, ${item2}]`, PythonOrder.ATOMIC];
  };

  // Lua
  luaGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = luaGenerator.valueToCode(block, "ITEM1", LuaOrder.ATOMIC) || "nil";
    const item2 = luaGenerator.valueToCode(block, "ITEM2", LuaOrder.ATOMIC) || "nil";
    return [`{${item1}, ${item2}}`, LuaOrder.ATOMIC];
  };

  // Dart
  dartGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = dartGenerator.valueToCode(block, "ITEM1", DartOrder.ATOMIC) || "null";
    const item2 = dartGenerator.valueToCode(block, "ITEM2", DartOrder.ATOMIC) || "null";
    return [`[${item1}, ${item2}]`, DartOrder.ATOMIC];
  };
};

// 🔹 Exportamos el toolbox de los bloques de listas
export const listToolbox = `
  <xml>
    <block type="create_list"></block>
  </xml>
`;