import { useBlocklyLogic } from "./hooks/useBlocklyLogic";
import { useCombinedObjectState } from "./hooks/useCombinedObjectState";
import SectionSelector from "./components/SectionSelector";
import CodeExecutionArea from "./components/CodeExecutionArea";
import ConsoleBlockView from "./components/ConsoleBlockView";
// import XmlDataBlockView from "./components/XmlDataBlockView";
// import Object2DView from "./components/Object2DView";
// import GraphicsView from "./components/GraphicsView";
import ThreeScene from "./components/3d/ThreeScene";

function App() {
  const {
    code,
    setCode,
    language,
    setLanguage,
    consoleOutput,
    setConsoleOutput,
    currentSection,
    sections,
    saveSection,
    handleSectionChange,
  } = useBlocklyLogic();

  // const { objects2D, objects3D, runCode } = useCombinedObjectState(setConsoleOutput);
  const {objects3D, runCode} = useCombinedObjectState(setConsoleOutput)

  const handleRunCode = () => runCode(code, language);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blockly con Generación y Ejecución de Código</h1>
      <SectionSelector
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onSaveSection={saveSection}
      />
      <CodeExecutionArea
        code={code}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
        loadBlocks={sections[currentSection]}
        onRunCode={handleRunCode}
      />
      <ConsoleBlockView consoleOutput={consoleOutput} />
      {/* <Object2DView objects={objects2D} /> */}
      <ThreeScene objects={objects3D} />
      {/* <XmlDataBlockView sections={sections} currentSection={currentSection} /> */}
      {/* <GraphicsView /> */}
      <div style={{width: "100%", height: "100px"}}></div>
    </div>
  );
}

export default App;