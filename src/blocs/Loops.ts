import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

export const addLoopBlocks = () => {
  // Bloque while
  if (!Blockly.Blocks["controls_whileUntil"]) {
    Blockly.Blocks["controls_whileUntil"] = {
      init() {
        this.appendValueInput("BOOL")
          .setCheck("Boolean")
          .appendField(new Blockly.FieldDropdown([["mientras", "WHILE"], ["hasta", "UNTIL"]]), "MODE")
          .appendField("que");
        this.appendStatementInput("DO").setCheck(null).appendField("hacer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["controls_whileUntil"] = function (block: Blockly.Block) {
    const mode = block.getFieldValue("MODE");
    const condition = javascriptGenerator.valueToCode(block, "BOOL", Order.ATOMIC) || "false";
    const branch = javascriptGenerator.statementToCode(block, "DO");
    return mode === "WHILE"
      ? `while (${condition}) {\n${branch}}\n`
      : `while (!${condition}) {\n${branch}}\n`;
  };

  // Bloque for
  if (!Blockly.Blocks["controls_for"]) {
    Blockly.Blocks["controls_for"] = {
      init() {
        this.appendDummyInput()
          .appendField("desde")
          .appendField(new Blockly.FieldVariable("i"), "VAR")
          .appendField("=");
        this.appendValueInput("FROM")
          .setCheck("Number")
          .appendField("");
        this.appendValueInput("TO")
          .setCheck("Number")
          .appendField("hasta");
        this.appendValueInput("BY")
          .setCheck("Number")
          .appendField("incremento");
        this.appendStatementInput("DO").setCheck(null).appendField("hacer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
  }

  javascriptGenerator.forBlock["controls_for"] = function (block: Blockly.Block) {
    const variable = javascriptGenerator.getVariableName(
      block.getFieldValue("VAR") || "i"
    );
    const from = javascriptGenerator.valueToCode(block, "FROM", Order.ATOMIC) || "0";
    const to = javascriptGenerator.valueToCode(block, "TO", Order.ATOMIC) || "10";
    const by = javascriptGenerator.valueToCode(block, "BY", Order.ATOMIC) || "1";
    const branch = javascriptGenerator.statementToCode(block, "DO");
    return `for (let ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${by}) {\n${branch}}\n`;
  };
};

export const loopToolbox = `
  <xml>
    <block type="controls_whileUntil"></block>
    <block type="controls_for"></block>
  </xml>
`;