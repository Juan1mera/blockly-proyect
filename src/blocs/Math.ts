import * as Blockly from "blockly/core";
import { javascriptGenerator, Order as JavascriptOrder } from "blockly/javascript";
import { phpGenerator, Order as PhpOrder } from "blockly/php";
import { pythonGenerator, Order as PythonOrder } from "blockly/python";
import { luaGenerator, Order as LuaOrder } from "blockly/lua";
import { dartGenerator, Order as DartOrder } from "blockly/dart";

export const addMathBlocks = () => {
  if (!Blockly.Blocks["math_operation"]) {
    Blockly.Blocks["math_operation"] = {
      init() {
        this.appendValueInput("A").setCheck("Number");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["+", "+"],
            ["-", "-"],
            ["*", "*"],
            ["/", "/"],
          ]),
          "OP"
        );
        this.appendValueInput("B").setCheck("Number");
        this.setOutput(true, "Number");
        this.setColour(230);
      },
    };
  }

  // JavaScript
  javascriptGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, "A", JavascriptOrder.ATOMIC) || "0";
    const b = javascriptGenerator.valueToCode(block, "B", JavascriptOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, JavascriptOrder.ATOMIC];
  };

  // PHP
  phpGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = phpGenerator.valueToCode(block, "A", PhpOrder.ATOMIC) || "0";
    const b = phpGenerator.valueToCode(block, "B", PhpOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, PhpOrder.ATOMIC];
  };

  // Python
  pythonGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, "A", PythonOrder.ATOMIC) || "0";
    const b = pythonGenerator.valueToCode(block, "B", PythonOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, PythonOrder.ATOMIC];
  };

  // Lua
  luaGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = luaGenerator.valueToCode(block, "A", LuaOrder.ATOMIC) || "0";
    const b = luaGenerator.valueToCode(block, "B", LuaOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, LuaOrder.ATOMIC];
  };

  // Dart
  dartGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = dartGenerator.valueToCode(block, "A", DartOrder.ATOMIC) || "0";
    const b = dartGenerator.valueToCode(block, "B", DartOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, DartOrder.ATOMIC];
  };
};

export const mathToolbox = `
  <xml>
    <block type="math_operation"></block>
  </xml>
`;