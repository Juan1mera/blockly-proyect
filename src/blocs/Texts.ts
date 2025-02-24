import * as Blockly from "blockly/core";
import { javascriptGenerator, Order as JavascriptOrder } from "blockly/javascript";
import { phpGenerator, Order as PhpOrder } from "blockly/php";
import { pythonGenerator, Order as PythonOrder } from "blockly/python";
import { luaGenerator, Order as LuaOrder } from "blockly/lua";
import { dartGenerator, Order as DartOrder } from "blockly/dart";

export const addTextBlocks = () => {
  // Block: Print text
  if (!Blockly.Blocks["text_print"]) {
    Blockly.Blocks["text_print"] = {
      init() {
        this.appendValueInput("TEXT").setCheck(null).appendField("Print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
  }

  javascriptGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = javascriptGenerator.valueToCode(block, "TEXT", JavascriptOrder.NONE) || '""';
    return `console.log(${text});\n`;
  };

  phpGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = phpGenerator.valueToCode(block, "TEXT", PhpOrder.NONE) || '""';
    return `echo ${text};\n`;
  };

  pythonGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = pythonGenerator.valueToCode(block, "TEXT", PythonOrder.NONE) || '""';
    return `print(${text})\n`;
  };

  luaGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = luaGenerator.valueToCode(block, "TEXT", LuaOrder.NONE) || '""';
    return `print(${text})\n`;
  };

  dartGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = dartGenerator.valueToCode(block, "TEXT", DartOrder.NONE) || '""';
    return `print(${text});\n`;
  };

  // Block: Create text
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

  javascriptGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, JavascriptOrder.NONE];
  };

  phpGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, PhpOrder.NONE];
  };

  pythonGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, PythonOrder.NONE];
  };

  luaGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, LuaOrder.NONE];
  };

  dartGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, DartOrder.NONE];
  };

  // Block: Set a variable
  if (!Blockly.Blocks["variables_set"]) {
    Blockly.Blocks["variables_set"] = {
      init() {
        this.appendDummyInput()
          .appendField("Set variable")
          .appendField(new Blockly.FieldVariable("myVar"), "VAR");
        this.appendValueInput("VALUE").setCheck(null).appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
      },
    };
  }

  javascriptGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const varName = javascriptGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    const value = javascriptGenerator.valueToCode(block, "VALUE", JavascriptOrder.NONE) || "null";
    return `${varName} = ${value};\n`;
  };

  phpGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const varName = phpGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    const value = phpGenerator.valueToCode(block, "VALUE", PhpOrder.NONE) || "null";
    return `$${varName} = ${value};\n`;
  };

  pythonGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const varName = pythonGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    const value = pythonGenerator.valueToCode(block, "VALUE", PythonOrder.NONE) || "None";
    return `${varName} = ${value}\n`;
  };

  luaGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const varName = luaGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    const value = luaGenerator.valueToCode(block, "VALUE", LuaOrder.NONE) || "nil";
    return `${varName} = ${value}\n`;
  };

  dartGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const varName = dartGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    const value = dartGenerator.valueToCode(block, "VALUE", DartOrder.NONE) || "null";
    return `${varName} = ${value};\n`;
  };

  // Block: Get a variable
  if (!Blockly.Blocks["variables_get"]) {
    Blockly.Blocks["variables_get"] = {
      init() {
        this.appendDummyInput()
          .appendField("Get variable")
          .appendField(new Blockly.FieldVariable("myVar"), "VAR");
        this.setOutput(true, null);
        this.setColour(330);
      },
    };
  }

  javascriptGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const varName = javascriptGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    return [varName, JavascriptOrder.NONE];
  };

  phpGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const varName = phpGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    return [`$${varName}`, PhpOrder.NONE];
  };

  pythonGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const varName = pythonGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    return [varName, PythonOrder.NONE];
  };

  luaGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const varName = luaGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    return [varName, LuaOrder.NONE];
  };

  dartGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const varName = dartGenerator.nameDB_?.getName(block.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) || "var";
    return [varName, DartOrder.NONE];
  };
};

// 🔹 Export the text toolbox
export const textToolbox = `
  <xml>
    <block type="text_print"></block>
    <block type="text"></block>
    <block type="math_number"></block>
    <block type="variables_set"></block>
    <block type="variables_get"></block>
  </xml>
`;
