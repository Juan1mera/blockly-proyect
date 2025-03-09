// Configuración del toolbox compartido
export const defaultToolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Movimiento",
        contents: [
          { kind: "block", type: "turn_right" },
          { kind: "block", type: "turn_left" },
          { kind: "block", type: "step_forward" },
          { kind: "block", type: "step_backward" },
          { kind: "block", type: "step_right" },
          { kind: "block", type: "step_left" },
        ],
      },
      {
        kind: "category",
        name: "Bucles",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
            inputs: {
              TIMES: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 5 },
                },
              },
            },
          },
        ],
      },
    ],
  };