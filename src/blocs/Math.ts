import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

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

  javascriptGenerator.forBlock["math_operation"] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, "A", Order.ATOMIC);
    const b = javascriptGenerator.valueToCode(block, "B", Order.ATOMIC);
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, Order.ATOMIC];
  };
};

// 🔹 Exportamos el toolbox de los bloques matemáticos
export const mathToolbox = `
  <xml>
    <block type="math_operation"></block>
  </xml>
`;