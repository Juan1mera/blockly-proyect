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
  loadBlocks?: string;
  setLoadXml?: (loadXml: (xml: string) => void) => void;
}> = ({ setCode, language, loadBlocks, setLoadXml }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  const loadXml = (xml: string) => {
    if (workspace.current) {
      if (!xml || xml.trim() === "") {
        console.warn("No se proporcionó XML válido para cargar.");
        return;
      }
      try {
        const xmlDom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace.current);
        const code = getCodeFromWorkspace(workspace.current, language);
        setCode(code);
      } catch (error) {
        console.error("Error cargando XML:", error);
        throw error;
      }
    }
  };

  useEffect(() => {
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

      workspace.current.addChangeListener(() => {
        if (workspace.current) {
          const code = getCodeFromWorkspace(workspace.current, language);
          setCode(code);
        }
      });

      if (setLoadXml) {
        setLoadXml(loadXml);
      }
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [setCode, setLoadXml]);

  useEffect(() => {
    if (workspace.current) {
      const code = getCodeFromWorkspace(workspace.current, language);
      setCode(code);
    }
  }, [language, setCode]);

  useEffect(() => {
    if (workspace.current && loadBlocks) {
      loadXml(loadBlocks);
    }
  }, [loadBlocks, language, setCode]);

  return <div ref={blocklyDiv} style={{ height: "520px", width: "100%" }} />;
};

export default BlocklyWorkspace;