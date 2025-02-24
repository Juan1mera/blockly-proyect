import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { pythonGenerator } from "blockly/python";
import { phpGenerator } from "blockly/php";
import { luaGenerator } from "blockly/lua";
import { dartGenerator } from "blockly/dart";

export const getCodeFromWorkspace = (
  workspace: Blockly.WorkspaceSvg | null,
  language: string
): string => {
  if (!workspace) return "";

  switch (language) {
    case "javascript":
      return javascriptGenerator.workspaceToCode(workspace);
    case "python":
      return pythonGenerator.workspaceToCode(workspace);
    case "php":
      return phpGenerator.workspaceToCode(workspace);
    case "lua":
      return luaGenerator.workspaceToCode(workspace);
    case "dart":
      return dartGenerator.workspaceToCode(workspace);
    default:
      return "// Lenguaje no soportado";
  }
};