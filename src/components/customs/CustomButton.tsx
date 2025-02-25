import { colors } from "../../constants/colors";

interface CustomButtonProps {
    onClick: () => void;
    text: string;
    bgColor?: string;
    key?: number;
}

function CustomButton({ onClick, text, bgColor = colors.morado, key }: CustomButtonProps) {
  return (
    <button 
        key={key}
        onClick={onClick} 
        style={{
            background: bgColor,
            color: "#fff",
            padding: "10  px 20px",
            marginLeft: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
        {text}
    </button>
  )
}

export default CustomButton