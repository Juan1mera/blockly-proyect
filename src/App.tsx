import { useState, useEffect } from "react";
import BlocklyWorkspace from "./components/BlocklyWorkspace";
import CodeDisplay from "./components/CodeDisplay";
import GraphicsView from "./components/GraphicsView";
import * as Blockly from "blockly";
import CustomButton from "./components/customs/CustomButton";
import { colors } from "./constants/colors";
import ConsoleBlockView from "./components/ConsoleBlockView";
import XmlDataBlockView from "./components/XmlDataBlockView";
import LenguajeSelect from "./views/blocks/components/LenguajeSelect";

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
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem("blockly_sections", JSON.stringify(sections));
  }, [sections]);

  const runCode = async () => {
    setConsoleOutput([]);
    const originalConsoleLog = console.log;
    let delayQueue: Promise<void> = Promise.resolve();

    // Redefinimos las funciones de movimiento con delay
    const moveRight = () => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
          setTimeout(resolve, 500); // Delay de 500ms
        })
      );
    };
    const moveLeft = () => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
          setTimeout(resolve, 500);
        })
      );
    };
    const moveUp = () => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setPosition((prev) => ({ ...prev, y: prev.y - 1 }));
          setTimeout(resolve, 500);
        })
      );
    };
    const moveDown = () => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
          setTimeout(resolve, 500);
        })
      );
    };

    // Redefinimos console.log con delay
    console.log = (...args: any[]) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setConsoleOutput((prev) => [...prev, args.join(" ")]);
          originalConsoleLog.apply(console, args);
          setTimeout(resolve, 500);
        })
      );
    };

    try {
      if (language === "javascript") {
        const fn = new Function(
          "moveRight",
          "moveLeft",
          "moveUp",
          "moveDown",
          "console",
          code
        );
        fn(moveRight, moveLeft, moveUp, moveDown, console);
        await delayQueue; // Esperamos a que todos los movimientos terminen
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
            key={section}
            onClick={() => handleSectionChange(section)}
            text={String(section)}
            style={{
              background: currentSection === section ? colors.morado : "#ccc",
              margin: "0 5px",
            }}
          />
        ))}
        <CustomButton
          onClick={saveSection}
          text={"Guardar Seccion " + currentSection}
          bgColor={colors.verde}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <BlocklyWorkspace
          setCode={setCode}
          language={language}
          loadBlocks={sections[currentSection]}
        />
        <div style={{ width: "50%" }}>
          <LenguajeSelect language={language} onChange={setLanguage} />
          <CodeDisplay code={code} language={language} />
        </div>
      </div>
      <CustomButton onClick={runCode} text="Ejecutar Código" />

      <ConsoleBlockView consoleOutput={consoleOutput} />

      <div
        style={{
          marginTop: "20px",
          width: "300px",
          height: "300px",
          border: "1px solid #ccc",
          position: "relative",
          background: "#f0f0f0",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "red",
            position: "absolute",
            left: `${position.x * 20}px`,
            top: `${position.y * 20}px`,
            transition: "all 0.3s ease",
          }}
        />
      </div>

      <XmlDataBlockView sections={sections} currentSection={currentSection} />
      <GraphicsView />
    </div>
  );
}

export default App;