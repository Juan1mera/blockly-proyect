import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import CustomButton from "../../components/customs/CustomButton";
import Map2DView from "./components/Map2DView";
import Map3DView from "./components/Map3DView";
import { useState, useEffect } from "react";

function Admin() {
  const [gridData, setGridData] = useState<string>(
    localStorage.getItem("adminGridData") || "2 0 1 0 1 1 1 1\n1 1 1 1 1 0 0 1\n0 0 1 1 1 1 1 1\n0 0 0 0 0 0 1 3"
  );

  useEffect(() => {
    localStorage.setItem("adminGridData", gridData);
  }, [gridData]);

  return (
    <div>
      <BlocklyWorkspace setCode={(code) => console.log(code)} language="javascript" />
      <CustomButton text="Guardar" onClick={() => console.log("Guardar")} />
      <Map2DView
        initialGrid={gridData}
        onGridChange={(newGridData) => setGridData(newGridData)}
      />
      {/* Mostrar los datos de la cuadrícula dentro de Admin para acceso interno */}
      <div style={{ marginTop: "20px" }}>
        <h3>Datos de la Cuadrícula</h3>
        <pre>{gridData}</pre>
      </div>
      <Map3DView gridData={gridData} /> 
    </div>
  );
}

export default Admin;