import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { addListBlocks, listToolbox } from "../blocs/Lists";
import { addLogicBlocks, logicToolbox } from "../blocs/Logic";
import { addLoopBlocks, loopToolbox } from "../blocs/Loops";
import { addMathBlocks, mathToolbox } from "../blocs/Math";
import { addTextBlocks, textToolbox } from "../blocs/Texts";
import { getCodeFromWorkspace } from "../utils/getCodeFromWorkspace";

const BlocklyWorkspace: React.FC<{
  setCode: (code: string) => void;
  language: string;
}> = ({ setCode, language }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  // Inicialización del workspace (solo una vez)
  useEffect(() => {
    // Registramos los bloques personalizados
    addLoopBlocks();
    addListBlocks();
    addTextBlocks();
    addMathBlocks();
    addLogicBlocks();

    const combinedToolbox = `
      <xml id="toolbox" style="display: none">
        ${loopToolbox.replace(/<\/?xml>/g, "")}
        ${listToolbox.replace(/<\/?xml>/g, "")}
        ${textToolbox.replace(/<\/?xml>/g, "")}
        ${mathToolbox.replace(/<\/?xml>/g, "")}
        ${logicToolbox.replace(/<\/?xml>/g, "")}
      </xml>
    `;

    if (blocklyDiv.current && !workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: combinedToolbox,
        scrollbars: true,
        trashcan: true,
      });

      // Listener para cambios en los bloques
      workspace.current.addChangeListener(() => {
        if (workspace.current) {
          const code = getCodeFromWorkspace(workspace.current, language);
          setCode(code);
        }
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [setCode]); // Quitamos 'language' de las dependencias

  // Efecto para actualizar el código cuando cambia el lenguaje
  useEffect(() => {
    if (workspace.current) {
      const code = getCodeFromWorkspace(workspace.current, language);
      setCode(code);
    }
  }, [language, setCode]); // Dependemos solo de 'language'

  return <div ref={blocklyDiv} style={{ height: "520px", width: "100%" }} />;
};

export default BlocklyWorkspace;