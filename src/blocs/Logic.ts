import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

// Extendemos el tipo Block para incluir propiedades y métodos personalizados
interface CustomBlock extends Blockly.Block {
  elseifCount_: number;
  elseCount_: number;
  valueConnection_?: Blockly.Connection | null;
  statementConnection_?: Blockly.Connection | null;
  rebuildFromMutation_: () => void;
  updateShape_: (
    valueConnections: (Blockly.Connection | null)[],
    statementConnections: (Blockly.Connection | null)[],
    elseStatementConnection: Blockly.Connection | null
  ) => void;
}

export const addLogicBlocks = () => {
  // Bloque de comparación
  if (!Blockly.Blocks["logic_compare"]) {
    Blockly.Blocks["logic_compare"] = {
      init() {
        this.appendValueInput("A").setCheck(null);
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["=", "=="],
            ["≠", "!="],
            ["<", "<"],
            [">", ">"],
            ["≤", "<="],
            ["≥", ">="],
          ]),
          "OP"
        );
        this.appendValueInput("B").setCheck(null);
        this.setOutput(true, "Boolean");
        this.setColour(210);
      },
    };
  }

  javascriptGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = javascriptGenerator.valueToCode(block, "B", Order.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, Order.ATOMIC];
  };

  // Bloque if/elseif/else
  if (!Blockly.Blocks["controls_if"]) {
    Blockly.Blocks["controls_if"] = {
      init() {
        this.appendValueInput("IF0")
          .setCheck("Boolean")
          .appendField("si");
        this.appendStatementInput("DO0").setCheck(null).appendField("hacer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        // Corregido: Usando la clase correcta para el mutator
        this.setMutator(
          new (Blockly as any).Mutator(["controls_if_elseif", "controls_if_else"])
        );
        (this as CustomBlock).elseifCount_ = 0;
        (this as CustomBlock).elseCount_ = 0;
      },
      mutationToDom(this: CustomBlock) {
        const container = Blockly.utils.xml.createElement("mutation");
        container.setAttribute("elseif", String(this.elseifCount_));
        container.setAttribute("else", String(this.elseCount_));
        return container;
      },
      domToMutation(this: CustomBlock, xmlElement: Element) {
        this.elseifCount_ = parseInt(xmlElement.getAttribute("elseif") || "0", 10);
        this.elseCount_ = parseInt(xmlElement.getAttribute("else") || "0", 10);
        this.rebuildFromMutation_();
      },
      decompose(this: CustomBlock, workspace: Blockly.WorkspaceSvg) {
        const containerBlock = workspace.newBlock("controls_if_if");
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        for (let i = 1; i <= this.elseifCount_; i++) {
          const elseifBlock = workspace.newBlock("controls_if_elseif");
          elseifBlock.initSvg();
          if (connection && elseifBlock.previousConnection) {
            connection.connect(elseifBlock.previousConnection);
            connection = elseifBlock.nextConnection;
          }
        }
        if (this.elseCount_) {
          const elseBlock = workspace.newBlock("controls_if_else");
          elseBlock.initSvg();
          if (connection && elseBlock.previousConnection) {
            connection.connect(elseBlock.previousConnection);
          }
        }
        return containerBlock;
      },
      compose(this: CustomBlock, containerBlock: Blockly.Block) {
        let clauseBlock = containerBlock.nextConnection!.targetBlock();
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
        const valueConnections: (Blockly.Connection | null)[] = [null];
        const statementConnections: (Blockly.Connection | null)[] = [null];
        let elseStatementConnection: Blockly.Connection | null = null;
        while (clauseBlock) {
          switch (clauseBlock.type) {
            case "controls_if_elseif":
              this.elseifCount_++;
              const valueConn = this.getInput(`IF${this.elseifCount_}`)?.connection?.targetConnection || null;
              const stateConn = this.getInput(`DO${this.elseifCount_}`)?.connection?.targetConnection || null;
              (clauseBlock as CustomBlock).valueConnection_ = valueConn;
              (clauseBlock as CustomBlock).statementConnection_ = stateConn;
              valueConnections.push(valueConn);
              statementConnections.push(stateConn);
              break;
            case "controls_if_else":
              this.elseCount_++;
              const elseConn = this.getInput("ELSE")?.connection?.targetConnection || null;
              (clauseBlock as CustomBlock).statementConnection_ = elseConn;
              elseStatementConnection = elseConn;
              break;
          }
          clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
        this.updateShape_(valueConnections, statementConnections, elseStatementConnection);
      },
      saveConnections(this: CustomBlock, containerBlock: Blockly.Block) {
        let clauseBlock = containerBlock.nextConnection!.targetBlock();
        let i = 1;
        while (clauseBlock) {
          switch (clauseBlock.type) {
            case "controls_if_elseif":
              const inputIf = this.getInput(`IF${i}`);
              const inputDo = this.getInput(`DO${i}`);
              (clauseBlock as CustomBlock).valueConnection_ =
                inputIf?.connection?.targetConnection || null;
              (clauseBlock as CustomBlock).statementConnection_ =
                inputDo?.connection?.targetConnection || null;
              i++;
              break;
            case "controls_if_else":
              const inputDoElse = this.getInput("ELSE");
              (clauseBlock as CustomBlock).statementConnection_ =
                inputDoElse?.connection?.targetConnection || null;
              break;
          }
          clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
      },
      updateShape_(
        this: CustomBlock,
        valueConnections: (Blockly.Connection | null)[],
        statementConnections: (Blockly.Connection | null)[],
        elseStatementConnection: Blockly.Connection | null
      ) {
        while (this.getInput(`IF${this.elseifCount_}`)) {
          this.removeInput(`IF${this.elseifCount_}`);
          this.removeInput(`DO${this.elseifCount_}`);
          this.elseifCount_--;
        }
        if (this.getInput("ELSE")) {
          this.removeInput("ELSE");
          this.elseCount_ = 0;
        }
        for (let i = 1; i <= this.elseifCount_; i++) {
          this.appendValueInput(`IF${i}`)
            .setCheck("Boolean")
            .appendField("sino si");
          this.appendStatementInput(`DO${i}`).setCheck(null).appendField("hacer");
        }
        if (this.elseCount_) {
          this.appendStatementInput("ELSE").setCheck(null).appendField("sino");
        }
        for (let i = 0; i < valueConnections.length - 1; i++) {
          const ifInput = this.getInput(`IF${i}`);
          const doInput = this.getInput(`DO${i}`);
          if (valueConnections[i] && ifInput?.connection) {
            ifInput.connection.connect(valueConnections[i]!);
          }
          if (statementConnections[i] && doInput?.connection) {
            doInput.connection.connect(statementConnections[i]!);
          }
        }
        const elseInput = this.getInput("ELSE");
        if (elseStatementConnection && elseInput?.connection) {
          elseInput.connection.connect(elseStatementConnection);
        }
      },
      rebuildFromMutation_(this: CustomBlock) {
        for (let i = 1; i <= this.elseifCount_; i++) {
          this.appendValueInput(`IF${i}`)
            .setCheck("Boolean")
            .appendField("sino si");
          this.appendStatementInput(`DO${i}`).setCheck(null).appendField("hacer");
        }
        if (this.elseCount_) {
          this.appendStatementInput("ELSE").setCheck(null).appendField("sino");
        }
      },
    };

    // Bloques auxiliares para el mutator
    Blockly.Blocks["controls_if_if"] = {
      init() {
        this.appendDummyInput().appendField("si");
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("Bloque principal de control if");
      },
    };

    Blockly.Blocks["controls_if_elseif"] = {
      init() {
        this.appendDummyInput().appendField("sino si");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip("Añadir una condición sino si");
      },
    };

    Blockly.Blocks["controls_if_else"] = {
      init() {
        this.appendDummyInput().appendField("sino");
        this.setPreviousStatement(true);
        this.setColour(210);
        this.setTooltip("Añadir un bloque sino");
      },
    };

    javascriptGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = javascriptGenerator.valueToCode(block, "IF0", Order.ATOMIC) || "false";
      const branch = javascriptGenerator.statementToCode(block, "DO0");
      code += `if (${condition}) {\n${branch}}\n`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = javascriptGenerator.valueToCode(block, `IF${i}`, Order.ATOMIC) || "false";
        const branchI = javascriptGenerator.statementToCode(block, `DO${i}`);
        code += `else if (${conditionI}) {\n${branchI}}\n`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = javascriptGenerator.statementToCode(block, "ELSE");
        code += `else {\n${elseBranch}}\n`;
      }

      return code;
    };
  }
};

export const logicToolbox = `
  <xml>
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
  </xml>
`;