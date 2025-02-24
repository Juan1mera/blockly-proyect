import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeDisplayProps {
  code: string;
  language?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language = 'javascript' }) => {
  return (
    <div style={{ width: "100%", borderRadius: "5px", overflow: "hidden" }}>
      <SyntaxHighlighter 
        language={language}
        style={atomDark}
        customStyle={{
          height: "500px",
          margin: 0,
          padding: "10px",
          fontFamily: "monospace",
        }}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;