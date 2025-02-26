import { colors } from "../constants/colors";
import CustomButton from "./customs/CustomButton";

interface SectionSelectorProps {
  currentSection: number;
  onSectionChange: (section: number) => void;
  onSaveSection: () => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  currentSection,
  onSectionChange,
  onSaveSection,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Sección: </label>
      {[1, 2, 3, 4, 5].map((section) => (
        <CustomButton
          key={section}
          onClick={() => onSectionChange(section)}
          text={String(section)}
          style={{
            background: currentSection === section ? colors.morado : "#ccc",
            margin: "0 5px",
          }}
        />
      ))}
      <CustomButton
        onClick={onSaveSection}
        text={"Guardar Seccion " + currentSection}
        bgColor={colors.verde}
      />
    </div>
  );
};

export default SectionSelector;