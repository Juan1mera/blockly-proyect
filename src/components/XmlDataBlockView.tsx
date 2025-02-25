import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface XmlDataBlockViewProps {
  sections?: { [key: number]: string }; // Ajustamos el tipo para sections
  currentSection: number;
}

function XmlDataBlockView({ sections = {}, currentSection }: XmlDataBlockViewProps) {
  return (
    <div>
      <h3
        style={{
          color: "#fff",
          marginTop: "20px",
          marginBottom: "0",
          paddingLeft: "10px",
          fontFamily: "monospace",
        }}
      >
        Datos de los Bloques (Sección {currentSection}):
      </h3>
      <SyntaxHighlighter
        language="xml"
        style={oneDark}
        customStyle={{
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
        {sections[currentSection] || "No hay bloques guardados en esta sección."}
      </SyntaxHighlighter>
    </div>
  );
}

export default XmlDataBlockView;