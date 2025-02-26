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
import Object2DView from "./components/Object2DView";

interface ObjectState {
  x: number;
  y: number;
  color: string;
}

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
  const [objects, setObjects] = useState<{ [id: string]: ObjectState }>({}); // Estado de los objetos

  useEffect(() => {
    localStorage.setItem("blockly_sections", JSON.stringify(sections));
  }, [sections]);

  const runCode = async () => {
    setConsoleOutput([]);
    const originalConsoleLog = console.log;
    let delayQueue: Promise<void> = Promise.resolve();

    const createObject = (id: string, x: number, y: number, color: string) => {
      setObjects((prev) => ({
        ...prev,
        [id]: { x, y, color },
      }));
    };

    const moveRight = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects((prev) => {
            if (!prev[id]) {
              console.log(`Error: Objeto "${id}" no existe.`);
              return prev; // No hacemos nada si el objeto no existe
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.min(prev[id].x + 1, 14) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveLeft = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects((prev) => {
            if (!prev[id]) {
              console.log(`Error: Objeto "${id}" no existe.`);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.max(prev[id].x - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveUp = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects((prev) => {
            if (!prev[id]) {
              console.log(`Error: Objeto "${id}" no existe.`);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.max(prev[id].y - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveDown = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects((prev) => {
            if (!prev[id]) {
              console.log(`Error: Objeto "${id}" no existe.`);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.min(prev[id].y + 1, 14) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const collides = (id1: string, id2: string) => {
      const obj1 = objects[id1];
      const obj2 = objects[id2];
      if (!obj1 || !obj2) return false;
      return obj1.x === obj2.x && obj1.y === obj2.y;
    };

    const touchesEdge = (id: string) => {
      const obj = objects[id];
      if (!obj) return false;
      return obj.x === 0 || obj.x === 14 || obj.y === 0 || obj.y === 14;
    };

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
          "createObject",
          "moveRight",
          "moveLeft",
          "moveUp",
          "moveDown",
          "collides",
          "touchesEdge",
          "console",
          code
        );
        fn(createObject, moveRight, moveLeft, moveUp, moveDown, collides, touchesEdge, console);
        await delayQueue;
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
      <Object2DView objects={objects} />
      <XmlDataBlockView sections={sections} currentSection={currentSection} />
      <GraphicsView />
    </div>
  );
}

export default App;