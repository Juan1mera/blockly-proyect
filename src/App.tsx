import { useState } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";

function App() {
  const [code, setCode] = useState<string>("");

  const runCode = () => {
    try {
      // eslint-disable-next-line no-eval
      eval(code);
    } catch (error) {
      console.error("Error ejecutando el código:", error);
      alert("Error al ejecutar el código.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>
      
      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace setCode={setCode} />
        <CodeDisplay code={code} />
      </div>

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

      <GraphicsView />
    </div>
  );
}

export default App;
