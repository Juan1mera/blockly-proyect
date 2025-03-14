import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Definición de bloques de movimiento
Blockly.Blocks['turn_right'] = {
  init: function() {
    this.appendDummyInput().appendField("Girar a la derecha");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

Blockly.Blocks['turn_left'] = {
  init: function() {
    this.appendDummyInput().appendField("Girar a la izquierda");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

Blockly.Blocks['step_forward'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso al frente");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

Blockly.Blocks['step_backward'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso atrás");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

Blockly.Blocks['step_right'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso a la derecha");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

Blockly.Blocks['step_left'] = {
  init: function() {
    this.appendDummyInput().appendField("Paso a la izquierda");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};

// Definición del bloque de repetición corregida
Blockly.Blocks['controls_repeat_ext'] = {
  init: function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("repetir");
    this.appendStatementInput("DO")
        .appendField("veces");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setInputsInline(true);
  }
};

// Generadores de código
javascriptGenerator.forBlock['turn_right'] = function() {
  return 'turnRight();\n';
};

javascriptGenerator.forBlock['turn_left'] = function() {
  return 'turnLeft();\n';
};

javascriptGenerator.forBlock['step_forward'] = function() {
  return 'stepForward();\n';
};

javascriptGenerator.forBlock['step_backward'] = function() {
  return 'stepBackward();\n';
};

javascriptGenerator.forBlock['step_right'] = function() {
  return 'stepRight();\n';
};

javascriptGenerator.forBlock['step_left'] = function() {
  return 'stepLeft();\n';
};

javascriptGenerator.forBlock['controls_repeat_ext'] = function(block) {
  let times = javascriptGenerator.valueToCode(block, 'TIMES', 0) || '5';
  const repeatCount = isNaN(parseInt(times)) ? 5 : parseInt(times);
  const code = javascriptGenerator.statementToCode(block, 'DO');
  let repeatedCode = '';
  for (let i = 0; i < repeatCount; i++) {
    repeatedCode += code;
  }
  return repeatedCode;
};

export const initializeBlockly = () => {
  console.log("Blockly blocks and generators initialized.");
};