import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader, MTLLoader, OBJLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Object3DState {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface LevelCell {
  x: number;
  z: number;
  type: "path" | "empty";
}

interface ThreeSceneProps {
  scenario?: Object3DState;
  user?: Object3DState;
  coins: Object3DState[];
  goal?: Object3DState;
  level?: LevelCell[];
  modelPaths?: {
    path: string;
    type: "gltf" | "obj" | "mtl";
  };
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ scenario, user, coins, goal, level, modelPaths }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const objectRefs = useRef<{ [key: string]: THREE.Mesh | THREE.Object3D }>({});

  const loader = useMemo(() => {
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    return { gltfLoader, objLoader, mtlLoader };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Fondo tipo cielo
    scene.background = new THREE.Color(0x87ceeb);

    // Posición inicial de la cámara (arriba del centro del plano)
    camera.position.set(3, 8, 3);
    camera.lookAt(3, 0, 3);

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.target.set(3, 0, 3);
    controls.update();
    controlsRef.current = controls;

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Limpiar objetos anteriores
    Object.keys(objectRefs.current).forEach((key) => {
      sceneRef.current?.remove(objectRefs.current[key]);
    });
    objectRefs.current = {};

    // Renderizar escenario (si existe)
    if (scenario) {
      const planeGeometry = new THREE.PlaneGeometry(6, 6);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: scenario.color, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.set(scenario.x + 3, scenario.y, scenario.z + 3);
      sceneRef.current.add(plane);
      objectRefs.current["scenario"] = plane;
    }

    // Renderizar usuario (si existe)
    if (user) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: user.color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(user.x + 0.5, user.y + 0.5, user.z + 0.5);
      sceneRef.current.add(cube);
      objectRefs.current["user"] = cube;
    }

    // Renderizar monedas
    coins.forEach((coin, index) => {
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: coin.color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(coin.x + 0.5, coin.y + 0.5, coin.z + 0.5);
      sceneRef.current!.add(sphere);
      objectRefs.current[`coin_${index}`] = sphere;
    });

    // Renderizar meta (si existe)
    if (goal) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: goal.color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(goal.x + 0.5, goal.y + 0.5, goal.z + 0.5);
      sceneRef.current.add(cube);
      objectRefs.current["goal"] = cube;
    }

    // Renderizar nivel dibujado como camino (si existe)
    if (level && modelPaths) {
      level.forEach((cell, index) => {
        if (cell.type === "path") {
          load3DModel(
            sceneRef.current!,
            loader,
            modelPaths,
            cell.x + 0.5,
            0.5,
            cell.z + 0.5,
            `path_${index}`
          );
        }
      });
    }
  }, [scenario, user, coins, goal, level, modelPaths]);

  const load3DModel = (
    scene: THREE.Scene,
    loaders: { gltfLoader: GLTFLoader; objLoader: OBJLoader; mtlLoader: MTLLoader },
    modelPaths: { path: string; type: "gltf" | "obj" | "mtl" },
    x: number,
    y: number,
    z: number,
    key: string
  ) => {
    const { gltfLoader, objLoader, mtlLoader } = loaders;
    const { path, type } = modelPaths;

    switch (type) {
      case "gltf":
        gltfLoader.load(
          path,
          (gltf) => {
            gltf.scene.position.set(x, y, z);
            scene.add(gltf.scene);
            objectRefs.current[key] = gltf.scene as unknown as THREE.Object3D; // Cast seguro
          },
          undefined,
          (error) => console.error("Error cargando GLTF:", error)
        );
        break;
      case "obj":
        mtlLoader.load(
          path.replace(".obj", ".mtl") || `${path}.mtl`,
          (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(
              path,
              (object) => {
                object.position.set(x, y, z);
                scene.add(object);
                objectRefs.current[key] = object as unknown as THREE.Object3D; // Cast seguro
              },
              undefined,
              (error) => console.error("Error cargando OBJ:", error)
            );
          },
          undefined,
          (error) => console.error("Error cargando MTL:", error)
        );
        break;
      case "mtl":
        console.warn("MTL solo se usa con OBJ; usa 'obj' para modelos completos.");
        break;
      default:
        console.error("Tipo de modelo no soportado");
    }
  };

  return <div ref={mountRef} style={{ width: "800px", height: "200px" }} />;
};

export default ThreeScene;