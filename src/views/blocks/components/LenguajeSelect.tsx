
interface LenguajeSelectProps {
  language: string;
  onChange: (language: string) => void;
}

function LenguajeSelect({ language, onChange }: LenguajeSelectProps) {
  return (
    <select
    value={language}
    onChange={(e) => onChange(e.target.value)}
    style={{ width: "100%" }}
  >
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="php">PHP</option>
    <option value="lua">Lua</option>
    <option value="dart">Dart</option>
  </select>
  )
}

export default LenguajeSelect