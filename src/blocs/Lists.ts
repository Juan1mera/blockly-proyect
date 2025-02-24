import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

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

  javascriptGenerator.forBlock["create_list"] = function (block: Blockly.Block) {
    const item1 = javascriptGenerator.valueToCode(block, "ITEM1", Order.ATOMIC);
    const item2 = javascriptGenerator.valueToCode(block, "ITEM2", Order.ATOMIC);
    return [`[${item1}, ${item2}]`, Order.ATOMIC];
  };
};

// 🔹 Exportamos el toolbox de los bloques de listas
export const listToolbox = `
  <xml>
    <block type="create_list"></block>
  </xml>
`;