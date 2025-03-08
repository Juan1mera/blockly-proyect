import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface Map3DViewProps {
  gridData: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  gridView?: boolean;
  onMovePlayer?: (moveFn: (direction: string) => boolean) => void;
  onFinish?: () => void;
}

interface ModelObject extends THREE.Object3D {
  scale: THREE.Vector3;
}

const Map3DView: React.FC<Map3DViewProps> = ({ gridData, containerRef, gridView = false, onMovePlayer, onFinish }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const objectRefs = useRef<{ [key: string]: THREE.Object3D }>({});
  const playerPosition = useRef<{ x: number; z: number; direction: string; rotation: number } | null>(null);
  const gridRef = useRef<number[][]>([]);
  const initialPosition = useRef<{ x: number; z: number; direction: string; rotation: number } | null>(null);
  const animationState = useRef<{ targetX: number; targetZ: number; targetRotation: number; progress: number; moving: boolean }>({
    targetX: 0,
    targetZ: 0,
    targetRotation: 0,
    progress: 1,
    moving: false,
  });

  useEffect(() => {
    const container = containerRef?.current || mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    scene.background = new THREE.Color(0x87ceeb);

    const rows = gridData.trim().split("\n");
    const grid = rows.map(row => row.trim().split(" ").map(state => parseInt(state)));
    gridRef.current = grid;
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

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

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
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

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const blockMtlPath = "/assets/3D/mtl/losa.mtl";
    const blockObjPath = "/assets/3D/obj/losa.obj";
    const playerMtlPath = "/assets/3D/mtl/capsula pj.mtl";
    const playerObjPath = "/assets/3D/obj/capsula pj.obj";
    const finishMtlPath = "/assets/3D/mtl/rocas.mtl";
    const finishObjPath = "/assets/3D/obj/rocas.obj";

    const models: Record<string, THREE.Object3D | null> = { block: null, player: null, finish: null };

    const checkAndRenderGrid = () => {
      if (models.block && models.player && models.finish) {
        renderGrid(models.block, models.player, models.finish, grid);
      }
    };

    mtlLoader.load(blockMtlPath, materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(blockObjPath, (blockObject: ModelObject) => {
        blockObject.scale.set(0.5, 0.5, 0.5);
        blockObject.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        models.block = blockObject;
        checkAndRenderGrid();
      }, undefined, error => console.error("Error cargando bloque:", error));
    });

    mtlLoader.load(playerMtlPath, materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(playerObjPath, (playerObject: ModelObject) => {
        playerObject.scale.set(0.5, 0.5, 0.5);
        playerObject.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        models.player = playerObject;
        checkAndRenderGrid();
      }, undefined, error => console.error("Error cargando jugador:", error));
    });

    mtlLoader.load(finishMtlPath, materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(finishObjPath, (finishObject: ModelObject) => {
        finishObject.scale.set(0.5, 0.5, 0.5);
        finishObject.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        models.finish = finishObject;
        checkAndRenderGrid();
      }, undefined, error => console.error("Error cargando meta:", error));
    });

    const renderGrid = (
      blockModel: THREE.Object3D,
      playerModel: THREE.Object3D,
      finishModel: THREE.Object3D,
      grid: number[][]
    ) => {
      if (!sceneRef.current) return;

      Object.values(objectRefs.current).forEach(obj => sceneRef.current?.remove(obj));
      objectRefs.current = {};

      for (let z = 0; z < gridHeight; z++) {
        for (let x = 0; x < gridWidth; x++) {
          const state = grid[z][x];
          if (state === 1) {
            const block = blockModel.clone();
            block.position.set(x, 0, z);
            sceneRef.current.add(block);
            objectRefs.current[`block_${x}_${z}`] = block;
          } else if (state === 2) {
            const needsBase = grid[z][x] !== 1;
            if (needsBase) {
              const baseBlock = blockModel.clone();
              baseBlock.position.set(x, 0, z);
              sceneRef.current.add(baseBlock);
              objectRefs.current[`block_base_${x}_${z}`] = baseBlock;
            }
            const player = playerModel.clone();
            player.position.set(x, 0.5, z);
            player.rotation.y = 0;
            sceneRef.current.add(player);
            objectRefs.current[`player_${x}_${z}`] = player;
            playerPosition.current = { x, z, direction: "right", rotation: 0 };
            initialPosition.current = { x, z, direction: "right", rotation: 0 };
          } else if (state === 3) {
            const needsBase = grid[z][x] !== 1;
            if (needsBase) {
              const baseBlock = blockModel.clone();
              baseBlock.position.set(x, 0, z);
              sceneRef.current.add(baseBlock);
              objectRefs.current[`block_base_${x}_${z}`] = baseBlock;
            }
            const finish = finishModel.clone();
            finish.position.set(x, 0.5, z);
            sceneRef.current.add(finish);
            objectRefs.current[`finish_${x}_${z}`] = finish;
          }
        }
      }

      if (gridView) {
        const gridHelper = new THREE.GridHelper(Math.max(gridWidth, gridHeight), Math.max(gridWidth, gridHeight));
        gridHelper.position.set(centerX, 0, centerZ);
        sceneRef.current.add(gridHelper);
        objectRefs.current["gridHelper"] = gridHelper;
      }

      controls.update();
    };

    const resetPlayer = () => {
      if (!sceneRef.current || !initialPosition.current || !playerPosition.current) return;
      const { x, z } = playerPosition.current;
      const player = objectRefs.current[`player_${x}_${z}`];
      if (player) {
        sceneRef.current.remove(player);
        delete objectRefs.current[`player_${x}_${z}`];
      }
      const initial = initialPosition.current;
      const newPlayer = models.player!.clone();
      newPlayer.position.set(initial.x, 0.5, initial.z);
      newPlayer.rotation.y = initial.rotation;
      sceneRef.current.add(newPlayer);
      objectRefs.current[`player_${initial.x}_${initial.z}`] = newPlayer;
      playerPosition.current = { ...initial };
      animationState.current = { targetX: initial.x, targetZ: initial.z, targetRotation: initial.rotation, progress: 1, moving: false };
    };

    const movePlayer = (command: string): boolean => {
      if (!playerPosition.current || !sceneRef.current || animationState.current.moving) return false;

      let { x, z, direction: currentDirection, rotation } = playerPosition.current;
      let newX = x;
      let newZ = z;
      let newDirection = currentDirection;
      let newRotation = rotation;

      const cleanedCommand = command.trim();

      switch (cleanedCommand) {
        case 'turnRight':
          newDirection = currentDirection === "right" ? "down" :
                        currentDirection === "down" ? "left" :
                        currentDirection === "left" ? "up" : "right";
          newRotation = currentDirection === "right" ? Math.PI / 2 :
                        currentDirection === "down" ? Math.PI :
                        currentDirection === "left" ? -Math.PI / 2 : 0;
          playerPosition.current.direction = newDirection;
          playerPosition.current.rotation = newRotation;
          animationState.current = { targetX: x, targetZ: z, targetRotation: newRotation, progress: 0, moving: true };
          console.log(`Girando a ${newDirection}`);
          return true;
        case 'turnLeft':
          newDirection = currentDirection === "right" ? "up" :
                         currentDirection === "up" ? "left" :
                         currentDirection === "left" ? "down" : "right";
          newRotation = currentDirection === "right" ? -Math.PI / 2 :
                        currentDirection === "up" ? Math.PI :
                        currentDirection === "left" ? Math.PI / 2 : 0;
          playerPosition.current.direction = newDirection;
          playerPosition.current.rotation = newRotation;
          animationState.current = { targetX: x, targetZ: z, targetRotation: newRotation, progress: 0, moving: true };
          console.log(`Girando a ${newDirection}`);
          return true;
        case 'stepForward':
          if (currentDirection === "right") newX++;
          else if (currentDirection === "left") newX--;
          else if (currentDirection === "up") newZ--;
          else if (currentDirection === "down") newZ++;
          break;
        case 'stepBackward':
          if (currentDirection === "right") newX--;
          else if (currentDirection === "left") newX++;
          else if (currentDirection === "up") newZ++;
          else if (currentDirection === "down") newZ--;
          break;
        case 'stepRight':
          if (currentDirection === "right") newZ++;
          else if (currentDirection === "left") newZ--;
          else if (currentDirection === "up") newX++;
          else if (currentDirection === "down") newX--;
          break;
        case 'stepLeft':
          if (currentDirection === "right") newZ--;
          else if (currentDirection === "left") newZ++;
          else if (currentDirection === "up") newX--;
          else if (currentDirection === "down") newX++;
          break;
        case 'reset':
          resetPlayer();
          return true;
        default:
          console.log(`Comando no reconocido: ${cleanedCommand}`);
          return false;
      }

      const gridWidth = gridRef.current[0].length;
      const gridHeight = gridRef.current.length;

      if (
        newX < 0 || newX >= gridWidth ||
        newZ < 0 || newZ >= gridHeight ||
        gridRef.current[newZ][newX] === 0
      ) {
        animationState.current = { targetX: newX, targetZ: newZ, targetRotation: rotation, progress: 0, moving: true };
        return false;
      }

      animationState.current = { targetX: newX, targetZ: newZ, targetRotation: rotation, progress: 0, moving: true };
      return true;
    };

    if (onMovePlayer) {
      onMovePlayer(movePlayer);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      if (playerPosition.current && animationState.current.moving) {
        const { targetX, targetZ, targetRotation, progress } = animationState.current;
        const player = objectRefs.current[`player_${playerPosition.current.x}_${playerPosition.current.z}`];
        if (player) {
          const speed = 0.05;
          animationState.current.progress = Math.min(progress + speed, 1);

          const currentX = THREE.MathUtils.lerp(playerPosition.current.x, targetX, animationState.current.progress);
          const currentZ = THREE.MathUtils.lerp(playerPosition.current.z, targetZ, animationState.current.progress);
          const currentRotation = THREE.MathUtils.lerp(playerPosition.current.rotation, targetRotation, animationState.current.progress);
          player.position.set(currentX, 0.5, currentZ);
          player.rotation.y = currentRotation;

          if (animationState.current.progress >= 1) {
            const newX = Math.round(targetX);
            const newZ = Math.round(targetZ);
            const gridWidth = gridRef.current[0].length;
            const gridHeight = gridRef.current.length;

            if (
              newX < 0 || newX >= gridWidth ||
              newZ < 0 || newZ >= gridHeight ||
              gridRef.current[newZ][newX] === 0
            ) {
              alert("¡Te saliste del camino o del mapa!");
            } else {
              delete objectRefs.current[`player_${playerPosition.current.x}_${playerPosition.current.z}`];
              objectRefs.current[`player_${newX}_${newZ}`] = player;
              playerPosition.current.x = newX;
              playerPosition.current.z = newZ;

              if (gridRef.current[newZ][newX] === 3) {
                onFinish?.();
              }
            }
            animationState.current.moving = false;
          }
        }
      }

      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      controlsRef.current?.dispose();
      sceneRef.current?.clear();
      rendererRef.current?.dispose();
    };
  }, [gridData, containerRef, gridView, onMovePlayer, onFinish]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: "400px", border: "1px solid black" }} />;
};

export default Map3DView;