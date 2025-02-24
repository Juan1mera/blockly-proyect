import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { addListBlocks, listToolbox } from "../blocs/Lists";
import { addLogicBlocks, logicToolbox } from "../blocs/Logic";
import { addLoopBlocks, loopToolbox } from "../blocs/Loops";
import { addMathBlocks, mathToolbox } from "../blocs/Math";
import { addTextBlocks, textToolbox } from "../blocs/Texts";
import { getCodeFromWorkspace } from "../utils/getCodeFromWorkspace";

interface BlockData {
  id: string;
  type: string;
  fields: { [key: string]: any };
  inputs: { [key: string]: BlockData | null };
  next?: BlockData | null;
}

const BlocklyWorkspace: React.FC<{
  setCode: (code: string) => void;
  language: string;
  setBlocksData?: (blocks: BlockData[]) => void;
  loadBlocks?: string;
  setLoadXml?: (loadXml: (xml: string) => void) => void; // Nueva prop para pasar la función de carga
}> = ({ setCode, language, setBlocksData, loadBlocks, setLoadXml }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  const getBlockData = (block: Blockly.Block): BlockData => {
    const blockData: BlockData = {
      id: block.id,
      type: block.type,
      fields: {},
      inputs: {},
    };

    block.inputList.forEach((input) => {
      input.fieldRow.forEach((field) => {
        if (field.name) {
          blockData.fields[field.name] = field.getValue();
        }
      });
    });

    block.inputList.forEach((input) => {
      if (input.connection && input.connection.targetBlock()) {
        blockData.inputs[input.name] = getBlockData(input.connection.targetBlock()!);
      }
    });

    if (block.nextConnection && block.nextConnection.targetBlock()) {
      blockData.next = getBlockData(block.nextConnection.targetBlock()!);
    }

    return blockData;
  };

  const updateBlocksData = () => {
    if (workspace.current && setBlocksData) {
      const topBlocks = workspace.current.getTopBlocks(false);
      const blocksData = topBlocks.map((block) => getBlockData(block));
      setBlocksData(blocksData);
    }
  };

  // Función para cargar XML en el workspace
  const loadXml = (xml: string) => {
    if (workspace.current) {
      try {
        const xmlDom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace.current);
        const code = getCodeFromWorkspace(workspace.current, language);
        setCode(code);
        updateBlocksData();
      } catch (error) {
        console.error("Error cargando XML:", error);
      }
    }
  };

  // Inicialización del workspace
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
          updateBlocksData();
        }
      });

      // Pasamos la función loadXml al componente padre
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

  // Actualizar código y datos cuando cambia el lenguaje
  useEffect(() => {
    if (workspace.current) {
      const code = getCodeFromWorkspace(workspace.current, language);
      setCode(code);
      updateBlocksData();
    }
  }, [language, setCode]);

  // Cargar bloques desde loadBlocks
  useEffect(() => {
    if (workspace.current && loadBlocks) {
      loadXml(loadBlocks);
    }
  }, [loadBlocks, language, setCode]);

  return <div ref={blocklyDiv} style={{ height: "520px", width: "100%" }} />;
};

export default BlocklyWorkspace;