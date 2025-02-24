import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks"; // Importa los bloques básicos
import { javascriptGenerator } from "blockly/javascript"; // Importa el generador JS

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

  // Función para ejecutar el código generado
  const runCode = () => {
    try {
      // eslint-disable-next-line no-eval
      eval(code);
    } catch (error) {
      console.error("Error ejecutando el código:", error);
      alert("Error al ejecutar el código. Revisa la consola.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>
      
      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        {/* Contenedor de Blockly */}
        <div ref={blocklyDiv} style={{ height: "500px", width: "100%" }}></div>

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

      {/* Botón para ejecutar el código */}
      <button
        onClick={runCode}
        style={{
          background: "#61dafb",
          color: "#000",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Ejecutar Código
      </button>
    </div>
  );
};

export default BlocklyComponent;
