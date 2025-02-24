import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import { addListBlocks, listToolbox } from "../blocs/Lists";
import { addLogicBlocks, logicToolbox } from "../blocs/Logic";
import { addLoopBlocks, loopToolbox } from "../blocs/Loops";
import { addMathBlocks, mathToolbox } from "../blocs/Math";
import { addTextBlocks, textToolbox } from "../blocs/Texts";

const BlocklyWorkspace: React.FC<{ setCode: (code: string) => void }> = ({ setCode }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    // Registramos los bloques personalizados
    addLoopBlocks();
    addListBlocks();
    addTextBlocks();
    addMathBlocks();
    addLogicBlocks();

    // Combinamos los toolboxes eliminando las etiquetas <xml> internas
    const combinedToolbox = `
      <xml id="toolbox" style="display: none">
        ${loopToolbox.replace(/<\/?xml>/g, "")}
        ${listToolbox.replace(/<\/?xml>/g, "")}
        ${textToolbox.replace(/<\/?xml>/g, "")}
        ${mathToolbox.replace(/<\/?xml>/g, "")}
        ${logicToolbox.replace(/<\/?xml>/g, "")}
      </xml>
    `;

    if (blocklyDiv.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: combinedToolbox,
        scrollbars: true,
        trashcan: true,
      });

      workspace.current.addChangeListener(() => {
        if (workspace.current) {
          const code = javascriptGenerator.workspaceToCode(workspace.current);
          setCode(code);
        }
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    };
  }, [setCode]);

  return <div ref={blocklyDiv} style={{ height: "520px", width: "100%", }} />;
};

export default BlocklyWorkspace;