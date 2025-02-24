import { useState } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";

// Tipo para los datos de los bloques (copiado de BlocklyWorkspace.tsx)
interface BlockData {
  id: string;
  type: string;
  fields: { [key: string]: any };
  inputs: { [key: string]: BlockData | null };
  next?: BlockData | null;
}

function App() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [blocksData, setBlocksData] = useState<BlockData[]>([]); // Estado para los datos de los bloques

  const runCode = () => {
    setConsoleOutput([]);
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      setConsoleOutput((prev) => [...prev, args.join(" ")]);
      originalConsoleLog.apply(console, args);
    };

    try {
      if (language === "javascript") {
        // eslint-disable-next-line no-eval
        eval(code);
      } else {
        alert(`Ejecución no soportada para ${language} en este entorno.`);
      }
    } catch (error) {
      console.error("Error ejecutando el código:", error);
      setConsoleOutput((prev) => [...prev, `Error: ${String(error)}`]);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace setCode={setCode} language={language} setBlocksData={setBlocksData} />
        <div style={{ width: "50%" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="php">PHP</option>
            <option value="lua">Lua</option>
            <option value="dart">Dart</option>
          </select>
          <CodeDisplay code={code} language={language} />
        </div>
      </div>

      <button
        onClick={runCode}
        style={{
          background: "#A097E2",
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

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#282c34",
          color: "#fff",
          fontFamily: "monospace",
          borderRadius: "5px",
          maxHeight: "200px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <h3>Salida de la Consola:</h3>
        {consoleOutput.length > 0 ? (
          consoleOutput.map((line, index) => <div key={index}>{line}</div>)
        ) : (
          <div>No hay salida todavía.</div>
        )}
      </div>

      {/* Área para mostrar los datos de los bloques */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#1e1e1e",
          color: "#fff",
          fontFamily: "monospace",
          borderRadius: "5px",
          maxHeight: "200px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <h3>Datos de los Bloques:</h3>
        {blocksData.length > 0 ? (
          <pre>{JSON.stringify(blocksData, null, 2)}</pre>
        ) : (
          <div>No hay bloques en el workspace.</div>
        )}
      </div>

      <GraphicsView />
    </div>
  );
}

export default App;