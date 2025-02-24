import * as Blockly from "blockly/core";
import { javascriptGenerator, Order as JavascriptOrder } from "blockly/javascript";
import { phpGenerator, Order as PhpOrder } from "blockly/php";
import { pythonGenerator, Order as PythonOrder } from "blockly/python";
import { luaGenerator, Order as LuaOrder } from "blockly/lua";
import { dartGenerator, Order as DartOrder } from "blockly/dart";

export const addTextBlocks = () => {
  // Bloque para mostrar texto
  if (!Blockly.Blocks["text_print"]) {
    Blockly.Blocks["text_print"] = {
      init() {
        this.appendValueInput("TEXT")
          .setCheck(null)
          .appendField("Mostrar texto:");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  // JavaScript
  javascriptGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = javascriptGenerator.valueToCode(block, "TEXT", JavascriptOrder.ATOMIC) || '""';
    return `console.log(${text});\n`;
  };

  // PHP
  phpGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = phpGenerator.valueToCode(block, "TEXT", PhpOrder.ATOMIC) || '""';
    return `echo ${text};\n`;
  };

  // Python
  pythonGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = pythonGenerator.valueToCode(block, "TEXT", PythonOrder.ATOMIC) || '""';
    return `print(${text})\n`;
  };

  // Lua
  luaGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = luaGenerator.valueToCode(block, "TEXT", LuaOrder.ATOMIC) || '""';
    return `print(${text})\n`;
  };

  // Dart
  dartGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = dartGenerator.valueToCode(block, "TEXT", DartOrder.ATOMIC) || '""';
    return `print(${text});\n`;
  };

  // Bloque para crear texto
  if (!Blockly.Blocks["text"]) {
    Blockly.Blocks["text"] = {
      init() {
        this.appendDummyInput()
          .appendField('"')
          .appendField(new Blockly.FieldTextInput(""), "TEXT")
          .appendField('"');
        this.setOutput(true, "String");
        this.setColour(160);
      },
    };
  }

  // JavaScript
  javascriptGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, JavascriptOrder.ATOMIC];
  };

  // PHP
  phpGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, PhpOrder.ATOMIC];
  };

  // Python
  pythonGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, PythonOrder.ATOMIC];
  };

  // Lua
  luaGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, LuaOrder.ATOMIC];
  };

  // Dart
  dartGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, DartOrder.ATOMIC];
  };

  // Bloque para crear una variable booleana
  if (!Blockly.Blocks["logic_boolean"]) {
    Blockly.Blocks["logic_boolean"] = {
      init() {
        this.appendDummyInput()
          .appendField(
            new Blockly.FieldDropdown([
              ["verdadero", "true"],
              ["falso", "false"],
            ]),
            "BOOL"
          );
        this.setOutput(true, "Boolean");
        this.setColour(210); // Color similar a bloques lógicos
      },
    };
  }

  // JavaScript
  javascriptGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL");
    return [boolValue, JavascriptOrder.ATOMIC];
  };

  // PHP
  phpGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL"); // "true" o "false"
    return [boolValue === "true" ? "true" : "false", PhpOrder.ATOMIC];
  };

  // Python
  pythonGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL");
    return [boolValue === "true" ? "True" : "False", PythonOrder.ATOMIC]; // Python usa True/False con mayúsculas
  };

  // Lua
  luaGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL");
    return [boolValue, LuaOrder.ATOMIC];
  };

  // Dart
  dartGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL");
    return [boolValue, DartOrder.ATOMIC];
  };
};

export const textToolbox = `
  <xml>
    <block type="text_print"></block>
    <block type="text"></block>
    <block type="math_number"></block>
    <block type="logic_boolean"></block>
  </xml>
`;