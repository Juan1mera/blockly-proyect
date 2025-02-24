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
};

export const textToolbox = `
  <xml>
    <block type="text_print"></block>
    <block type="text"></block>
    <block type="math_number"></block>
  </xml>
`;