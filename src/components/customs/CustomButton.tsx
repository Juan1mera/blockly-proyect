
interface CustomButtonProps {
    onClick: () => void;
    text: string;
}

function CustomButton({ onClick, text }: CustomButtonProps) {
  return (
    <button 
        onClick={onClick} 
        style={{
            background: "#4caf50",
            color: "#fff",
            padding: "5px 10px",
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