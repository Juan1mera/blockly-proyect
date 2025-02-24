import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

export const addLogicBlocks = () => {
  // Block: logic_if (If - Do)
  Blockly.Blocks["logic_if"] = {
    init() {
      this.appendValueInput("IF").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").setCheck(null).appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_if"] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, "IF", Order.NONE) || "false";
    const doCode = javascriptGenerator.statementToCode(block, "DO");
    return `if (${condition}) {\n${doCode}}\n`;
  };

  // Block: logic_if_else (If - Do / Else - Do)
  Blockly.Blocks["logic_if_else"] = {
    init() {
      this.appendValueInput("IF").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").setCheck(null).appendField("do");
      this.appendStatementInput("ELSE").setCheck(null).appendField("else do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_if_else"] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, "IF", Order.NONE) || "false";
    const doCode = javascriptGenerator.statementToCode(block, "DO");
    const elseCode = javascriptGenerator.statementToCode(block, "ELSE");
    return `if (${condition}) {\n${doCode}}\nelse {\n${elseCode}}\n`;
  };

  // Block: logic_if_elseif_else (If - Do / Else If - Do / Else - Do)
  Blockly.Blocks["logic_if_elseif_else"] = {
    init() {
      this.appendValueInput("IF").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").setCheck(null).appendField("do");
      this.appendValueInput("ELSE_IF").setCheck("Boolean").appendField("else if");
      this.appendStatementInput("DO_ELSE_IF").setCheck(null).appendField("do");
      this.appendStatementInput("ELSE").setCheck(null).appendField("else do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_if_elseif_else"] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, "IF", Order.NONE) || "false";
    const doCode = javascriptGenerator.statementToCode(block, "DO");

    const elseIfCondition = javascriptGenerator.valueToCode(block, "ELSE_IF", Order.NONE);
    const doElseIf = javascriptGenerator.statementToCode(block, "DO_ELSE_IF");

    const elseCode = javascriptGenerator.statementToCode(block, "ELSE");

    let code = `if (${condition}) {\n${doCode}}\n`;
    if (elseIfCondition) {
      code += `else if (${elseIfCondition}) {\n${doElseIf}}\n`;
    }
    if (elseCode) {
      code += `else {\n${elseCode}}\n`;
    }
    return code;
  };

  // Block: logic_operation (AND, OR)
  Blockly.Blocks["logic_operation"] = {
    init() {
      this.appendValueInput("A").setCheck("Boolean");
      this.appendValueInput("B")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldDropdown([
          ["AND", "AND"],
          ["OR", "OR"]
        ]), "OP");
      this.setInputsInline(true);
      this.setOutput(true, "Boolean");
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_operation"] = function (block: Blockly.Block) {
    const operator = block.getFieldValue("OP") === "AND" ? "&&" : "||";
    const argument0 = javascriptGenerator.valueToCode(
      block,
      "A",
      operator === "&&" ? Order.LOGICAL_AND : Order.LOGICAL_OR
    ) || "false";
    const argument1 = javascriptGenerator.valueToCode(
      block,
      "B",
      operator === "&&" ? Order.LOGICAL_AND : Order.LOGICAL_OR
    ) || "false";

    const code = `${argument0} ${operator} ${argument1}`;
    const order = operator === "&&" ? Order.LOGICAL_AND : Order.LOGICAL_OR;
    return [code, order];
  };

  // Block: logic_negate (NOT)
  Blockly.Blocks["logic_negate"] = {
    init() {
      this.appendValueInput("BOOL").setCheck("Boolean").appendField("NOT");
      this.setOutput(true, "Boolean");
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_negate"] = function (block: Blockly.Block) {
    const argument0 = javascriptGenerator.valueToCode(block, "BOOL", Order.LOGICAL_NOT) || "false";
    const code = `!${argument0}`;
    return [code, Order.LOGICAL_NOT];
  };

  // Block: logic_boolean (true/false)
  Blockly.Blocks["logic_boolean"] = {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["true", "TRUE"],
          ["false", "FALSE"]
        ]), "BOOL");
      this.setOutput(true, "Boolean");
      this.setColour(210);
    },
  };

  javascriptGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
    return [code, Order.ATOMIC];
  };
};

// 🔹 Export the logic toolbox
export const logicToolbox = `
  <xml>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_if"></block>
    <block type="logic_if_else"></block>
    <block type="logic_if_elseif_else"></block>
  </xml>
`;
