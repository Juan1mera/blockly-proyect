import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript"; // Importa el generador de código JS

export const getCodeFromWorkspace = (workspace: Blockly.WorkspaceSvg | null): string => {
  return workspace ? javascriptGenerator.workspaceToCode(workspace) : "";
};
