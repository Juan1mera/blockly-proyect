import { useState } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";

function App() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]); // Estado para la salida de la consola

  const runCode = () => {
    // Limpiamos la salida anterior
    setConsoleOutput([]);

    // Guardamos la función original de console.log
    const originalConsoleLog = console.log;

    // Sobreescribimos console.log para capturar la salida
    console.log = (...args: any[]) => {
      setConsoleOutput((prev) => [...prev, args.join(" ")]);
      originalConsoleLog.apply(console, args); // Opcional: mantener la salida en la consola del navegador
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
      // Restauramos console.log a su estado original
      console.log = originalConsoleLog;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace setCode={setCode} language={language} />
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

      {/* Área para mostrar la salida de la consola */}
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

      <GraphicsView />
    </div>
  );
}

export default App;