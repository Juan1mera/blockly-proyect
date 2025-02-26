import LenguajeSelect from "../views/blocks/components/LenguajeSelect";
import BlocklyWorkspace from "./BlocklyWorkspace";
import CodeDisplay from "./CodeDisplay";
import CustomButton from "./customs/CustomButton";

interface CodeExecutionAreaProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  loadBlocks: string;
  onRunCode: () => void;
}

const CodeExecutionArea: React.FC<CodeExecutionAreaProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  loadBlocks,
  onRunCode,
}) => {
  return (
    <div style={{ display: "flex", gap: "20px", width: "100%" }}>
      <BlocklyWorkspace setCode={setCode} language={language} loadBlocks={loadBlocks} />
      <div style={{ width: "50%" }}>
        <LenguajeSelect language={language} onChange={setLanguage} />
        <CodeDisplay code={code} language={language} />
      </div>
      <CustomButton onClick={onRunCode} text="Ejecutar Código" />
    </div>
  );
};

export default CodeExecutionArea;