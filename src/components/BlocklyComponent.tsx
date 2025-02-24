import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks"; // Importa los bloques básicos
import { javascriptGenerator } from "blockly/javascript"; // Importar generador JS

const BlocklyComponent: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (blocklyDiv.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: `
          <xml>
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="text"></block>
            <block type="text_print"></block>
          </xml>
        `,
      });

      // Escuchar cambios en el workspace
      workspace.current.addChangeListener(() => {
        if (workspace.current) {
          // Usar el generador de código actualizado
          const generatedCode = javascriptGenerator.workspaceToCode(workspace.current);
          setCode(generatedCode);
        }
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Contenedor de Blockly */}
      <div ref={blocklyDiv} style={{ height: "500px", width: "60%" }}></div>

      {/* Contenedor del Código Generado */}
      <textarea
        value={code}
        readOnly
        style={{
          width: "40%",
          height: "500px",
          background: "#282c34",
          color: "#61dafb",
          fontFamily: "monospace",
          padding: "10px",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default BlocklyComponent;
