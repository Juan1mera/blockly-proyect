
interface XmlDataBlockViewProps {
  sections?: any;
  currentSection: number;
}

function XmlDataBlockView({ sections, currentSection }: XmlDataBlockViewProps) {
  return (
    <div
    style={{
      marginTop: "20px",
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
    <h3>Datos de los Bloques (Sección {currentSection}):</h3>
    {sections[currentSection] ? (
      <pre>{sections[currentSection]}</pre>
    ) : (
      <div>No hay bloques guardados en esta sección.</div>
    )}
  </div>
  )
}

export default XmlDataBlockView