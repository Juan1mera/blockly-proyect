import { useBlocklyLogic } from "./hooks/useBlocklyLogic";
import { useObjectState } from "./hooks/useObjectState";
import SectionSelector from "./components/SectionSelector";
import CodeExecutionArea from "./components/CodeExecutionArea";
import ConsoleBlockView from "./components/ConsoleBlockView";
import XmlDataBlockView from "./components/XmlDataBlockView";
import Object2DView from "./components/Object2DView";
import GraphicsView from "./components/GraphicsView";

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

  const { objects, runCode } = useObjectState(setConsoleOutput);

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
      <Object2DView objects={objects} />
      <XmlDataBlockView sections={sections} currentSection={currentSection} />
      <GraphicsView />
    </div>
  );
}

export default App;