
interface ConsoleBlockViewProps {
  consoleOutput: string[];
}

function ConsoleBlockView({ consoleOutput }: ConsoleBlockViewProps) {
  return (
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
  )
}

export default ConsoleBlockView