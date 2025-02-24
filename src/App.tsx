import { useState, useEffect } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";
import * as Blockly from "blockly";

function App() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [sections, setSections] = useState<{ [key: number]: string }>(() => {
    // Cargar estado inicial desde localStorage
    const savedSections = localStorage.getItem("blockly_sections");
    return savedSections
      ? JSON.parse(savedSections)
      : { 1: "", 2: "", 3: "", 4: "", 5: "" };
  });
  const [xmlInput, setXmlInput] = useState<string>("");
  const [loadXml, setLoadXml] = useState<((xml: string) => void) | null>(null);

  // Guardar sections en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("blockly_sections", JSON.stringify(sections));
  }, [sections]);

  // Inicializar xmlInput con el XML de la sección actual al montar
  useEffect(() => {
    setXmlInput(sections[currentSection] || "");
  }, [currentSection, sections]);

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
      setXmlInput(xmlText);
      alert(`Sección ${currentSection} guardada en localStorage.`);
    }
  };

  const loadXmlBlocks = () => {
    if (loadXml) {
      if (!xmlInput || xmlInput.trim() === "") {
        alert("Por favor, ingresa un XML válido en el campo de texto.");
        return;
      }
      try {
        loadXml(xmlInput);
        setSections((prev) => ({
          ...prev,
          [currentSection]: xmlInput,
        }));
        alert(`Bloques cargados y guardados en la Sección ${currentSection} en localStorage.`);
      } catch (error) {
        console.error("Error cargando bloques:", error);
        alert(`Error: El XML ingresado no es válido. Detalles: ${String(error)}`);
      }
    } else {
      alert("El workspace no está listo para cargar bloques todavía.");
    }
  };

  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
    const sectionXml = sections[section] || "";
    setXmlInput(sectionXml);
    if (loadXml && sectionXml) {
      loadXml(sectionXml);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Sección: </label>
        {[1, 2, 3, 4, 5].map((section) => (
          <button
            key={section}
            onClick={() => handleSectionChange(section)}
            style={{
              background: currentSection === section ? "#61dafb" : "#ccc",
              color: "#000",
              padding: "5px 10px",
              margin: "0 5px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {section}
          </button>
        ))}
        <button
          onClick={saveSection}
          style={{
            background: "#4caf50",
            color: "#fff",
            padding: "5px 10px",
            marginLeft: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Guardar Sección {currentSection}
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace
          setCode={setCode}
          language={language}
          loadBlocks={sections[currentSection]}
          setLoadXml={setLoadXml}
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

      <div style={{ marginTop: "20px" }}>
        <h3>Editar o Importar XML para la Sección {currentSection}:</h3>
        <textarea
          value={xmlInput}
          onChange={(e) => setXmlInput(e.target.value)}
          placeholder="Pega o edita el XML de los bloques aquí"
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            fontFamily: "monospace",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={loadXmlBlocks}
          style={{
            background: "#2196f3",
            color: "#fff",
            padding: "10px 20px",
            marginTop: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cargar Bloques en Sección {currentSection}
        </button>
      </div>

      <GraphicsView />
    </div>
  );
}

export default App;