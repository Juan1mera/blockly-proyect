import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import CustomButton from "../../components/customs/CustomButton";
import Map2DView from "./components/Map2DView";
import Map3DView from "./components/Map3DView";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para obtener levelId de la URL

function Admin() {
  const { levelId } = useParams<{ levelId: string }>(); // Obtener el ID del nivel desde la URL
  const levelNumber = parseInt(levelId || "1", 10); // Convertir a número, por defecto 1

  const [gridData, setGridData] = useState<string>(
    localStorage.getItem(`level_${levelNumber}_gridData`) || 
    "2 0 1 0 1 1 1 1\n1 1 1 1 1 0 0 1\n0 0 1 1 1 1 1 1\n0 0 0 0 0 0 1 3"
  );
  const [blocksCode, setBlocksCode] = useState<string>(
    localStorage.getItem(`level_${levelNumber}_blocksCode`) || "" // Cargar bloques desde localStorage
  );

  useEffect(() => {
    // Guardar gridData en localStorage cuando cambie
    localStorage.setItem(`level_${levelNumber}_gridData`, gridData);
  }, [gridData, levelNumber]);

  useEffect(() => {
    // Guardar blocksCode en localStorage cuando cambie
    localStorage.setItem(`level_${levelNumber}_blocksCode`, blocksCode);
  }, [blocksCode, levelNumber]);

  const handleSave = () => {
    // Estructura del nivel
    const levelData = {
      nivel: levelNumber, // Usar el número del nivel desde la URL
      bloques: blocksCode, // Código generado por los bloques en BlocklyWorkspace
      mapa: gridData, // Datos de la cuadrícula
    };

    // Sobrescribir o guardar en localStorage bajo una clave específica (por ejemplo, "level_data_1")
    localStorage.setItem(`level_${levelNumber}`, JSON.stringify(levelData));
    console.log("Nivel guardado:", levelData);
  };

  return (
    <div>
      <BlocklyWorkspace 
        setCode={(code) => {
          console.log(code);
          setBlocksCode(code); // Guardar el código de los bloques
        }} 
        language="javascript" 
      />
      <div style={{ height: "20px" }} />
      <CustomButton text="Guardar" onClick={handleSave} />
      <div style={{ height: "20px" }} />
      <Map2DView
        initialGrid={gridData}
        onGridChange={(newGridData) => setGridData(newGridData)}
      />
      {/* Mostrar los datos de la cuadrícula dentro de Admin para acceso interno */}
      <div style={{ marginTop: "20px" }}>
        <h3>Datos de la Cuadrícula (Nivel {levelNumber})</h3>
        <pre>{gridData}</pre>
      </div>
      <Map3DView gridData={gridData} gridView />
      <div style={{ height: "200px" }} />
    </div>
  );
}

export default Admin;