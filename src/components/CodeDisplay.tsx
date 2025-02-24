import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark as monokai } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeDisplay: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  return (
    <SyntaxHighlighter
      language={language} // Usamos el lenguaje seleccionado
      style={monokai}
      customStyle={{
        width: "100%", // Ajustamos para que ocupe todo el contenedor padre
        height: "500px",
        margin: 0,
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "monospace",
        resize: "none",
      }}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeDisplay;