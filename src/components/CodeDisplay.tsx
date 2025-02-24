const CodeDisplay: React.FC<{ code: string }> = ({ code }) => {
    return (
      <textarea
        value={code}
        readOnly
        style={{
          width: "40%",
          height: "500px",
          background: "#282c34",
          color: "#61dafb",
          fontFamily: "monospace",
          padding: "10px",
          borderRadius: "5px",
        }}
      />
    );
  };
  
  export default CodeDisplay;
  