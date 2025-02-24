import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { addListBlocks, listToolbox } from "../blocs/Lists";
import { addLogicBlocks, logicToolbox } from "../blocs/Logic";
import { addLoopBlocks, loopToolbox } from "../blocs/Loops";
import { addMathBlocks, mathToolbox } from "../blocs/Math";
import { addTextBlocks, textToolbox } from "../blocs/Texts";
import { getCodeFromWorkspace } from "../utils/getCodeFromWorkspace";

// Tipo para la información de los bloques
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
  setBlocksData?: (blocks: BlockData[]) => void; // Nueva prop opcional
}> = ({ setCode, language, setBlocksData }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  // Función para extraer datos de un bloque
  const getBlockData = (block: Blockly.Block): BlockData => {
    const blockData: BlockData = {
      id: block.id,
      type: block.type,
      fields: {},
      inputs: {},
    };

    // Obtener valores de los campos
    block.inputList.forEach((input) => {
      input.fieldRow.forEach((field) => {
        if (field.name) {
          blockData.fields[field.name] = field.getValue();
        }
      });
    });

    // Obtener entradas (conexiones a otros bloques)
    block.inputList.forEach((input) => {
      if (input.connection && input.connection.targetBlock()) {
        blockData.inputs[input.name] = getBlockData(input.connection.targetBlock()!);
      }
    });

    // Obtener el siguiente bloque (si existe)
    if (block.nextConnection && block.nextConnection.targetBlock()) {
      blockData.next = getBlockData(block.nextConnection.targetBlock()!);
    }

    return blockData;
  };

  // Función para actualizar los datos de los bloques
  const updateBlocksData = () => {
    if (workspace.current && setBlocksData) {
      const allBlocks = workspace.current.getAllBlocks(false); // false para no ordenar por posición
      const topBlocks = workspace.current.getTopBlocks(false); // Bloques raíz
      const blocksData = topBlocks.map((block) => getBlockData(block));
      setBlocksData(blocksData);
    }
  };

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
          updateBlocksData(); // Actualizamos los datos de los bloques
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

  // Efecto para actualizar el código y datos cuando cambia el lenguaje
  useEffect(() => {
    if (workspace.current) {
      const code = getCodeFromWorkspace(workspace.current, language);
      setCode(code);
      updateBlocksData(); // Actualizamos los datos de los bloques
    }
  }, [language, setCode]);

  return <div ref={blocklyDiv} style={{ height: "520px", width: "100%" }} />;
};

export default BlocklyWorkspace;