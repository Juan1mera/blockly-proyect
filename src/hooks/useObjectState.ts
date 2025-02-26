import { useState } from "react";

interface ObjectState {
  x: number;
  y: number;
  color: string;
}

export const useObjectState = (setConsoleOutput: React.Dispatch<React.SetStateAction<string[]>>) => {
  const [objects, setObjects] = useState<{ [id: string]: ObjectState }>({});

  const runCode = async (code: string, language: string) => {
    const originalConsoleLog = console.log;
    let delayQueue: Promise<void> = Promise.resolve();

    const createObject = (id: string, x: number, y: number, color: string) => {
      setObjects((prev) => ({
        ...prev,
        [id]: { x, y, color },
      }));
    };

    const moveRight = (id: string) => {
      delayQueue = delayQueue.then(() =>
        new Promise((resolve) => {
          setObjects((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto "${id}" no existe.`,
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
          setObjects((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto "${id}" no existe.`,
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
          setObjects((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto "${id}" no existe.`,
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
          setObjects((prev) => {
            if (!prev[id]) {
              setConsoleOutput((prevOutput: string[]) => [
                ...prevOutput,
                `Error: Objeto "${id}" no existe.`,
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
      const obj1 = objects[id1];
      const obj2 = objects[id2];
      if (!obj1 || !obj2) return false;
      return obj1.x === obj2.x && obj1.y === obj2.y;
    };

    const touchesEdge = (id: string) => {
      const obj = objects[id];
      if (!obj) return false;
      return obj.x === 0 || obj.x === 14 || obj.y === 0 || obj.y === 14;
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
          "console",
          code
        );
        fn(createObject, moveRight, moveLeft, moveUp, moveDown, collides, touchesEdge, console);
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

  return { objects, setObjects, runCode };
};