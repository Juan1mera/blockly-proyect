import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface Map3DViewProps {
  gridData: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

interface ModelObject extends THREE.Object3D {
  scale: THREE.Vector3;
}

const Map3DView: React.FC<Map3DViewProps> = ({ gridData, containerRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const objectRefs = useRef<{ [key: string]: THREE.Object3D }>({});

  useEffect(() => {
    // Usar el contenedor pasado como prop o el mountRef por defecto
    const container = containerRef?.current || mountRef.current;
    if (!container) return;

    // Obtener dimensiones del contenedor
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    
    // Configurar escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Función para manejar cambios de tamaño
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Fondo tipo cielo
    scene.background = new THREE.Color(0x87ceeb);

    // Parsear gridData para determinar dimensiones
    const rows = gridData.trim().split("\n");
    const grid = rows.map((row) => row.trim().split(" ").map((state) => parseInt(state)));
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    // Configurar cámara y controles para centrarse en el centro del plano
    const centerX = (gridWidth - 1) / 2;
    const centerZ = (gridHeight - 1) / 2;
    camera.position.set(centerX, gridHeight * 1.5, gridHeight + centerZ);
    camera.lookAt(centerX, 0, centerZ);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(centerX, 0, centerZ);
    controls.update();
    controlsRef.current = controls;

    // Añadir luces
    // Luz ambiental para iluminación general
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Luz direccional principal (como el sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(centerX, gridHeight * 2, centerZ);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -gridWidth;
    directionalLight.shadow.camera.right = gridWidth;
    directionalLight.shadow.camera.top = gridHeight;
    directionalLight.shadow.camera.bottom = -gridHeight;
    scene.add(directionalLight);

    // Añadir un plano para representar el suelo
    const groundGeometry = new THREE.PlaneGeometry(gridWidth * 1.5, gridHeight * 1.5);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22, 
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.set(centerX, -0.1, centerZ);
    ground.receiveShadow = true;
    scene.add(ground);

    // Crear cuadrícula para visualizar el mapa
    const gridHelper = new THREE.GridHelper(Math.max(gridWidth, gridHeight), Math.max(gridWidth, gridHeight));
    gridHelper.position.set(centerX, 0, centerZ);
    scene.add(gridHelper);

    // Loaders para modelos .obj
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    // Rutas a los modelos .obj
    const blockMtlPath = "./src/assets/3D/mtl/Cubo.mtl";
    const blockObjPath = "./src/assets/3D/obj/Cubo.obj";
    const playerMtlPath = "./src/assets/3D/mtl/arbol.mtl";
    const playerObjPath = "./src/assets/3D/obj/arbol.obj";
    const finishMtlPath = "./src/assets/3D/mtl/arbusto.mtl";
    const finishObjPath = "./src/assets/3D/obj/arbusto.obj";

    // Objeto para almacenar los modelos cargados
    const models: Record<string, THREE.Object3D | null> = {
      block: null,
      player: null,
      finish: null
    };

    // Función para renderizar la cuadrícula después de cargar todos los modelos
    const checkAndRenderGrid = () => {
      if (models.block && models.player && models.finish) {
        renderGrid(models.block, models.player, models.finish);
      }
    };

    // Cargar modelo de bloque (terreno)
    mtlLoader.load(
      blockMtlPath, 
      (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(
          blockObjPath, 
          (blockObject: ModelObject) => {
            blockObject.scale.set(0.5, 0.5, 0.5);
            blockObject.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            models.block = blockObject;
            checkAndRenderGrid();
          },
          undefined,
          (error) => console.error('Error cargando bloque:', error)
        );
      },
      undefined,
      (error) => console.error('Error cargando materiales de bloque:', error)
    );

    // Cargar modelo de jugador (palmera)
    mtlLoader.load(
      playerMtlPath, 
      (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(
          playerObjPath, 
          (playerObject: ModelObject) => {
            playerObject.scale.set(0.5, 0.5, 0.5);
            playerObject.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            models.player = playerObject;
            checkAndRenderGrid();
          },
          undefined,
          (error) => console.error('Error cargando jugador:', error)
        );
      },
      undefined,
      (error) => console.error('Error cargando materiales de jugador:', error)
    );

    // Cargar modelo de meta (arbusto)
    mtlLoader.load(
      finishMtlPath, 
      (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(
          finishObjPath, 
          (finishObject: ModelObject) => {
            finishObject.scale.set(0.5, 0.5, 0.5);
            finishObject.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            models.finish = finishObject;
            checkAndRenderGrid();
          },
          undefined,
          (error) => console.error('Error cargando meta:', error)
        );
      },
      undefined,
      (error) => console.error('Error cargando materiales de meta:', error)
    );

    const renderGrid = (
      blockModel: THREE.Object3D,
      playerModel: THREE.Object3D,
      finishModel: THREE.Object3D
    ) => {
      if (!sceneRef.current) return;

      // Limpiar objetos anteriores
      Object.values(objectRefs.current).forEach((obj) => sceneRef.current?.remove(obj));
      objectRefs.current = {};

      // Iterar por la cuadrícula para crear objetos
      for (let z = 0; z < gridHeight; z++) {
        for (let x = 0; x < gridWidth; x++) {
          const state = grid[z][x];
          
          if (state === 1) {
            // Terreno (cubo)
            const block = blockModel.clone();
            block.position.set(x, 0, z);
            sceneRef.current.add(block);
            objectRefs.current[`block_${x}_${z}`] = block;
          } else if (state === 2) {
            // Jugador (palmera) - Añadir un cubo debajo si no hay terreno
            if (x > 0 && z > 0 && x < gridWidth && z < gridHeight) {
              // Verificar si hay terreno en esta posición
              const needsBase = grid[z][x] !== 1;
              
              if (needsBase) {
                // Crear un cubo como base
                const baseBlock = blockModel.clone();
                baseBlock.position.set(x, 0, z);
                sceneRef.current.add(baseBlock);
                objectRefs.current[`block_base_${x}_${z}`] = baseBlock;
              }
            }
            
            // Añadir la palmera
            const player = playerModel.clone();
            player.position.set(x, 0.5, z);
            sceneRef.current.add(player);
            objectRefs.current[`player_${x}_${z}`] = player;
          } else if (state === 3) {
            // Meta (arbusto) - Añadir un cubo debajo si no hay terreno
            if (x > 0 && z > 0 && x < gridWidth && z < gridHeight) {
              // Verificar si hay terreno en esta posición
              const needsBase = grid[z][x] !== 1;
              
              if (needsBase) {
                // Crear un cubo como base
                const baseBlock = blockModel.clone();
                baseBlock.position.set(x, 0, z);
                sceneRef.current.add(baseBlock);
                objectRefs.current[`block_base_${x}_${z}`] = baseBlock;
              }
            }
            
            // Añadir el arbusto
            const finish = finishModel.clone();
            finish.position.set(x, 0.5, z);
            sceneRef.current.add(finish);
            objectRefs.current[`finish_${x}_${z}`] = finish;
          }
        }
      }

      // Ajustar cámara y controles después de renderizar
      controls.update();
    };

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      controlsRef.current?.dispose();
      sceneRef.current?.clear();
      rendererRef.current?.dispose();
    };
  }, [gridData, containerRef]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: "400px", border: "1px solid black" }} />;
};

export default Map3DView;