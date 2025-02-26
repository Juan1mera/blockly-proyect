import { useState } from "react";

interface ThreeObjectState {
  x: number;
  y: number;
  z: number;
  color: string;
}

export const useThreeObjectState = (setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>) => {
  const [threeObjects, setThreeObjects] = useState<{ [id: string]: ThreeObjectState }>({});

  const runThreeCode = async (code: string, language: string) => {
    const originalConsoleLog = console.log;
    let delayQueue: Promise<void> = Promise.resolve();

    const create3DObject = (id: string, x: number, y: number, z: number, color: string) => {
      setThreeObjects((prev) => ({
        ...prev,
        [id]: { x, y, z, color },
      }));
    };

    const move3DRight = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setThreeObjects((prev) => {
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
          setThreeObjects((prev) => {
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
          setThreeObjects((prev) => {
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
          setThreeObjects((prev) => {
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
          setThreeObjects((prev) => {
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
          setThreeObjects((prev) => {
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
      console.error("Error ejecutando el código 3D:", error);
      setConsoleOutput((prev: string[]) => [...prev, `Error: ${String(error)}`]);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return { threeObjects, setThreeObjects, runThreeCode };
};