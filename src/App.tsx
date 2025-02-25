import { useState, useEffect } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";
import * as Blockly from "blockly";
import CustomButton from "./components/customs/CustomButton";
import { colors } from "./constants/colors";

function App() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [sections, setSections] = useState<{ [key: number]: string }>(() => {
    const savedSections = localStorage.getItem("blockly_sections");
    return savedSections
      ? JSON.parse(savedSections)
      : { 1: "", 2: "", 3: "", 4: "", 5: "" };
  });

  // Guardar sections en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("blockly_sections", JSON.stringify(sections));
  }, [sections]);

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

  const saveSection = () => {
    const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    if (workspace) {
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToPrettyText(xml);
      setSections((prev) => ({
        ...prev,
        [currentSection]: xmlText,
      }));
      alert(`Sección ${currentSection} guardada en localStorage.`);
    }
  };

  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Sección: </label>
        {[1, 2, 3, 4, 5].map((section) => (
          <CustomButton 
            onClick={() => handleSectionChange(section)} 
            text={String(section)}
            style={{
              background: currentSection === section ? colors.morado : "#ccc",
              margin: "0 5px",
            }}
          />
        ))}
        <CustomButton onClick={saveSection} text={"Guardar Seccion " + currentSection} bgColor={colors.verde} />
      </div>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace
          setCode={setCode}
          language={language}
          loadBlocks={sections[currentSection]}
        />
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
      <CustomButton onClick={runCode} text="Ejecutar Código" />

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
        <h3>Datos de los Bloques (Sección {currentSection}):</h3>
        {sections[currentSection] ? (
          <pre>{sections[currentSection]}</pre>
        ) : (
          <div>No hay bloques guardados en esta sección.</div>
        )}
      </div>

      <GraphicsView />
    </div>
  );
}

export default App;