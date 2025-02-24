import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

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

  javascriptGenerator.forBlock["text_print"] = function (block: Blockly.Block) {
    const text = javascriptGenerator.valueToCode(block, "TEXT", Order.ATOMIC) || '""';
    return `console.log(${text});\n`;
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

  javascriptGenerator.forBlock["text"] = function (block: Blockly.Block) {
    const text = block.getFieldValue("TEXT");
    return [`"${text}"`, Order.ATOMIC];
  };

  // Bloque para definir una variable genérica
  if (!Blockly.Blocks["variables_set"]) {
    Blockly.Blocks["variables_set"] = {
      init() {
        this.appendValueInput("VALUE")
          .setCheck(null)
          .appendField("establecer")
          .appendField(new Blockly.FieldVariable("variable"), "VAR")
          .appendField("a");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
      },
    };
  }

  javascriptGenerator.forBlock["variables_set"] = function (block: Blockly.Block) {
    const variable = javascriptGenerator.getVariableName(
      block.getFieldValue("VAR") || "variable"
    );
    const value = javascriptGenerator.valueToCode(block, "VALUE", Order.ATOMIC) || "0";
    return `let ${variable} = ${value};\n`;
  };

  // Bloque para obtener una variable
  if (!Blockly.Blocks["variables_get"]) {
    Blockly.Blocks["variables_get"] = {
      init() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldVariable("variable"), "VAR");
        this.setOutput(true, null);
        this.setColour(330);
      },
    };
  }

  javascriptGenerator.forBlock["variables_get"] = function (block: Blockly.Block) {
    const variable = javascriptGenerator.getVariableName(
      block.getFieldValue("VAR") || "variable"
    );
    return [variable, Order.ATOMIC];
  };

  // Bloque para definir una variable booleana
  if (!Blockly.Blocks["variables_set_boolean"]) {
    Blockly.Blocks["variables_set_boolean"] = {
      init() {
        this.appendDummyInput()
          .appendField("establecer")
          .appendField(new Blockly.FieldVariable("esVerdadero"), "VAR")
          .appendField("a")
          .appendField(
            new Blockly.FieldDropdown([
              ["verdadero", "true"],
              ["falso", "false"],
            ]),
            "VALUE"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210); // Color similar a los bloques lógicos
      },
    };
  }

  javascriptGenerator.forBlock["variables_set_boolean"] = function (block: Blockly.Block) {
    const variable = javascriptGenerator.getVariableName(
      block.getFieldValue("VAR") || "esVerdadero"
    );
    const value = block.getFieldValue("VALUE");
    return `let ${variable} = ${value};\n`;
  };

  // Bloque para crear un valor booleano
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
        this.setColour(210);
      },
    };
  }

  javascriptGenerator.forBlock["logic_boolean"] = function (block: Blockly.Block) {
    const boolValue = block.getFieldValue("BOOL");
    return [boolValue, Order.ATOMIC];
  };
};

export const textToolbox = `
  <xml>
    <block type="text_print"></block>
    <block type="text"></block>
    <block type="math_number"></block>
    <block type="variables_set"></block>
    <block type="variables_get"></block>
    <block type="variables_set_boolean"></block>
    <block type="logic_boolean"></block>
  </xml>
`;