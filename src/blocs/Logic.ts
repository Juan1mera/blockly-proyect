import * as Blockly from "blockly";
import { javascriptGenerator, Order as JavascriptOrder } from "blockly/javascript";
import { phpGenerator, Order as PhpOrder } from "blockly/php";
import { pythonGenerator, Order as PythonOrder } from "blockly/python";
import { luaGenerator, Order as LuaOrder } from "blockly/lua";
import { dartGenerator, Order as DartOrder } from "blockly/dart";

// Extendemos el tipo Block para incluir propiedades y métodos personalizados
interface CustomBlock extends Blockly.Block {
  elseifCount_: number;
  elseCount_: number;
  updateShape_: () => void;
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

  // JavaScript
  javascriptGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, "A", JavascriptOrder.ATOMIC) || "0";
    const b = javascriptGenerator.valueToCode(block, "B", JavascriptOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, JavascriptOrder.ATOMIC];
  };

  // PHP
  phpGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = phpGenerator.valueToCode(block, "A", PhpOrder.ATOMIC) || "0";
    const b = phpGenerator.valueToCode(block, "B", PhpOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, PhpOrder.ATOMIC];
  };

  // Python
  pythonGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, "A", PythonOrder.ATOMIC) || "0";
    const b = pythonGenerator.valueToCode(block, "B", PythonOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, PythonOrder.ATOMIC];
  };

  // Lua
  luaGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = luaGenerator.valueToCode(block, "A", LuaOrder.ATOMIC) || "0";
    const b = luaGenerator.valueToCode(block, "B", LuaOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, LuaOrder.ATOMIC];
  };

  // Dart
  dartGenerator.forBlock["logic_compare"] = function (block: Blockly.Block) {
    const a = dartGenerator.valueToCode(block, "A", DartOrder.ATOMIC) || "0";
    const b = dartGenerator.valueToCode(block, "B", DartOrder.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`${a} ${op} ${b}`, DartOrder.ATOMIC];
  };

  // Bloque if/elseif/else simplificado
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
        // Usamos type assertion para evitar el error de TypeScript
        this.setMutator(new (Blockly as any).Mutator(["controls_if_elseif", "controls_if_else"]));
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
        this.updateShape_();
      },
      decompose(this: CustomBlock, workspace: Blockly.WorkspaceSvg) {
        const containerBlock = workspace.newBlock("controls_if_if");
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        for (let i = 1; i <= this.elseifCount_; i++) {
          const elseifBlock = workspace.newBlock("controls_if_elseif");
          elseifBlock.initSvg();
          connection?.connect(elseifBlock.previousConnection);
          connection = elseifBlock.nextConnection;
        }
        if (this.elseCount_) {
          const elseBlock = workspace.newBlock("controls_if_else");
          elseBlock.initSvg();
          connection?.connect(elseBlock.previousConnection);
        }
        return containerBlock;
      },
      compose(this: CustomBlock, containerBlock: Blockly.Block) {
        let clauseBlock = containerBlock.nextConnection?.targetBlock() || null;
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
        while (this.getInput(`IF${this.elseifCount_}`)) {
          this.removeInput(`IF${this.elseifCount_}`);
          this.removeInput(`DO${this.elseifCount_}`);
        }
        if (this.getInput("ELSE")) {
          this.removeInput("ELSE");
        }
        while (clauseBlock) {
          switch (clauseBlock.type) {
            case "controls_if_elseif":
              this.elseifCount_++;
              this.appendValueInput(`IF${this.elseifCount_}`)
                .setCheck("Boolean")
                .appendField("sino si");
              this.appendStatementInput(`DO${this.elseifCount_}`)
                .setCheck(null)
                .appendField("hacer");
              break;
            case "controls_if_else":
              this.elseCount_++;
              this.appendStatementInput("ELSE").setCheck(null).appendField("sino");
              break;
          }
          clauseBlock = clauseBlock.nextConnection?.targetBlock() || null;
        }
      },
      updateShape_(this: CustomBlock) {
        while (this.getInput(`IF${this.elseifCount_}`)) {
          this.removeInput(`IF${this.elseifCount_}`);
          this.removeInput(`DO${this.elseifCount_}`);
        }
        if (this.getInput("ELSE")) {
          this.removeInput("ELSE");
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
      },
    };

    // Bloques auxiliares para el mutator
    if (!Blockly.Blocks["controls_if_if"]) {
      Blockly.Blocks["controls_if_if"] = {
        init() {
          this.appendDummyInput().appendField("si");
          this.setNextStatement(true);
          this.setColour(210);
          this.setTooltip("Bloque principal de control if");
        },
      };
    }

    if (!Blockly.Blocks["controls_if_elseif"]) {
      Blockly.Blocks["controls_if_elseif"] = {
        init() {
          this.appendDummyInput().appendField("sino si");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(210);
          this.setTooltip("Añadir una condición sino si");
        },
      };
    }

    if (!Blockly.Blocks["controls_if_else"]) {
      Blockly.Blocks["controls_if_else"] = {
        init() {
          this.appendDummyInput().appendField("sino");
          this.setPreviousStatement(true);
          this.setColour(210);
          this.setTooltip("Añadir un bloque sino");
        },
      };
    }

    // JavaScript
    javascriptGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = javascriptGenerator.valueToCode(block, "IF0", JavascriptOrder.ATOMIC) || "false";
      const branch = javascriptGenerator.statementToCode(block, "DO0");
      code += `if (${condition}) {\n${branch}}\n`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = javascriptGenerator.valueToCode(block, `IF${i}`, JavascriptOrder.ATOMIC) || "false";
        const branchI = javascriptGenerator.statementToCode(block, `DO${i}`);
        code += `else if (${conditionI}) {\n${branchI}}\n`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = javascriptGenerator.statementToCode(block, "ELSE");
        code += `else {\n${elseBranch}}\n`;
      }

      return code;
    };

    // PHP
    phpGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = phpGenerator.valueToCode(block, "IF0", PhpOrder.ATOMIC) || "false";
      const branch = phpGenerator.statementToCode(block, "DO0").trim();
      code += `if (${condition}) {\n${branch}\n}`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = phpGenerator.valueToCode(block, `IF${i}`, PhpOrder.ATOMIC) || "false";
        const branchI = phpGenerator.statementToCode(block, `DO${i}`).trim();
        code += ` elseif (${conditionI}) {\n${branchI}\n}`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = phpGenerator.statementToCode(block, "ELSE").trim();
        code += ` else {\n${elseBranch}\n}`;
      }

      code += "}";
      return code;
    };

    // Python
    pythonGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = pythonGenerator.valueToCode(block, "IF0", PythonOrder.ATOMIC) || "False";
      const branch = pythonGenerator.statementToCode(block, "DO0").trim();
      code += `if ${condition}:\n${branch}`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = pythonGenerator.valueToCode(block, `IF${i}`, PythonOrder.ATOMIC) || "False";
        const branchI = pythonGenerator.statementToCode(block, `DO${i}`).trim();
        code += `\nelif ${conditionI}:\n${branchI}`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = pythonGenerator.statementToCode(block, "ELSE").trim();
        code += `\nelse:\n${elseBranch}`;
      }

      return code + "\n";
    };

    // Lua
    luaGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = luaGenerator.valueToCode(block, "IF0", LuaOrder.ATOMIC) || "false";
      const branch = luaGenerator.statementToCode(block, "DO0").trim();
      code += `if ${condition} then\n${branch}`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = luaGenerator.valueToCode(block, `IF${i}`, LuaOrder.ATOMIC) || "false";
        const branchI = luaGenerator.statementToCode(block, `DO${i}`).trim();
        code += `\nelseif ${conditionI} then\n${branchI}`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = luaGenerator.statementToCode(block, "ELSE").trim();
        code += `\nelse\n${elseBranch}`;
      }

      return code + "\nend\n";
    };

    // Dart
    dartGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
      let code = "";
      const condition = dartGenerator.valueToCode(block, "IF0", DartOrder.ATOMIC) || "false";
      const branch = dartGenerator.statementToCode(block, "DO0").trim();
      code += `if (${condition}) {\n${branch}\n}`;

      const blockAsCustom = block as CustomBlock;
      for (let i = 1; i <= blockAsCustom.elseifCount_; i++) {
        const conditionI = dartGenerator.valueToCode(block, `IF${i}`, DartOrder.ATOMIC) || "false";
        const branchI = dartGenerator.statementToCode(block, `DO${i}`).trim();
        code += ` else if (${conditionI}) {\n${branchI}\n}`;
      }

      if (blockAsCustom.elseCount_) {
        const elseBranch = dartGenerator.statementToCode(block, "ELSE").trim();
        code += ` else {\n${elseBranch}\n}`;
      }

      return code + "}";
    };
  }
};

export const logicToolbox = `
  <xml>
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
  </xml>
`;