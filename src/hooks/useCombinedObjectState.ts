import { useState } from "react";

interface Object2DState {
  x: number;
  y: number;
  color: string;
}

interface Object3DState {
  x: number;
  y: number;
  z: number;
  color: string;
}

export const useCombinedObjectState = (setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>) => {
  const [objects2D, setObjects2D] = useState<{ [id: string]: Object2DState }>({});
  const [objects3D, setObjects3D] = useState<{ [id: string]: Object3DState }>({});

  const runCode = async (code: string, language: string) => {
    const originalConsoleLog = console.log;
    let delayQueue: Promise<void> = Promise.resolve();

    // Funciones para 2D
    const createObject = (id: string, x: number, y: number, color: string) => {
      setObjects2D((prev) => ({
        ...prev,
        [id]: { x, y, color },
      }));
    };

    const moveRight = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects2D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 2D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.min(prev[id].x + 1, 14) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveLeft = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects2D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 2D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.max(prev[id].x - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveUp = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects2D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 2D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.max(prev[id].y - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const moveDown = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects2D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 2D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.min(prev[id].y + 1, 14) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const collides = (id1: string, id2: string) => {
      const obj1 = objects2D[id1];
      const obj2 = objects2D[id2];
      if (!obj1 || !obj2) return false;
      return obj1.x === obj2.x && obj1.y === obj2.y;
    };

    const touchesEdge = (id: string) => {
      const obj = objects2D[id];
      if (!obj) return false;
      return obj.x === 0 || obj.x === 14 || obj.y === 0 || obj.y === 14;
    };

    // Funciones para 3D
    const create3DObject = (id: string, x: number, y: number, z: number, color: string) => {
      setObjects3D((prev) => ({
        ...prev,
        [id]: { x, y, z, color },
      }));
    };

    const move3DRight = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.min(prev[id].x + 1, 5) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const move3DLeft = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], x: Math.max(prev[id].x - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const move3DUp = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.min(prev[id].y + 1, 5) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const move3DDown = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], y: Math.max(prev[id].y - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const move3DForward = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], z: Math.min(prev[id].z + 1, 5) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    const move3DBackward = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects3D((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto 3D "${id}" no existe.`,
              ]);
              return prev;
            }
            return {
              ...prev,
              [id]: { ...prev[id], z: Math.max(prev[id].z - 1, 0) },
            };
          });
          setTimeout(resolve, 500);
        })
      );
    };

    console.log = (...args: any[]) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setConsoleOutput((prev: string[]) => [...prev, args.join(" ")]);
          originalConsoleLog.apply(console, args);
          setTimeout(resolve, 500);
        })
      );
    };

    try {
      if (language === "javascript") {
        const fn = new Function(
          "createObject",
          "moveRight",
          "moveLeft",
          "moveUp",
          "moveDown",
          "collides",
          "touchesEdge",
          "create3DObject",
          "move3DRight",
          "move3DLeft",
          "move3DUp",
          "move3DDown",
          "move3DForward",
          "move3DBackward",
          "console",
          code
        );
        fn(
          createObject,
          moveRight,
          moveLeft,
          moveUp,
          moveDown,
          collides,
          touchesEdge,
          create3DObject,
          move3DRight,
          move3DLeft,
          move3DUp,
          move3DDown,
          move3DForward,
          move3DBackward,
          console
        );
        await delayQueue;
      } else {
        alert(`Ejecución no soportada para ${language} en este entorno.`);
      }
    } catch (error) {
      console.error("Error ejecutando el código:", error);
      setConsoleOutput((prev: string[]) => [...prev, `Error: ${String(error)}`]);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return { objects2D, setObjects2D, objects3D, setObjects3D, runCode };
};