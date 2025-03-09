import { colors } from "../../../Lib/constants/colors";

interface CustomButtonProps {
    onClick: () => void;
    text: string;
    bgColor?: string;
    key?: number;
    style?: React.CSSProperties;
}

function CustomButton({ onClick, text, bgColor = colors.morado, style }: CustomButtonProps) {
  return (
    <button 
        onClick={onClick} 
        style={{
            background: bgColor,
            color: "#fff",
            padding: "10px 20px",
            marginLeft: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            ...style
          }}
        >
        {text}
    </button>
  )
}

export default CustomButton