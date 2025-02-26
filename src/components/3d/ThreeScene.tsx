import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeObjectState {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface ThreeSceneProps {
  objects: { [id: string]: ThreeObjectState };
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ objects }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRefs = useRef<{ [id: string]: THREE.Mesh }>({});

  useEffect(() => {
    // Configuración inicial de la escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 300);
    mountRef.current?.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Plataforma 6x6
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2; // Rotar para que esté horizontal
    scene.add(plane);

    // Cuadrícula 6x6
    const gridHelper = new THREE.GridHelper(6, 6, 0x888888, 0x888888);
    scene.add(gridHelper);

    // Posición inicial de la cámara
    camera.position.set(3, 5, 5);
    camera.lookAt(0, 0, 0);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Limpiar cubos anteriores
    Object.keys(cubeRefs.current).forEach((id) => {
      sceneRef.current?.remove(cubeRefs.current[id]);
    });
    cubeRefs.current = {};

    // Crear o actualizar cubos según el estado objects
    Object.entries(objects).forEach(([id, { x, y, z, color }]) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);

      // Posicionar el cubo en el centro de la casilla
      cube.position.set(x + 0.5, y + 0.5, z + 0.5);
      sceneRef.current?.add(cube);
      cubeRefs.current[id] = cube;
    });
  }, [objects]);

  return <div ref={mountRef} style={{ width: "300px", height: "300px" }} />;
};

export default ThreeScene;