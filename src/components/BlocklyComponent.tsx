import { useEffect, useRef } from "react";
import * as Blockly from "blockly";

import "blockly/blocks"; // Importa los bloques básicos

const BlocklyComponent: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: `
          <xml>
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="text"></block>
            <block type="text_print"></block>
          </xml>
        `,
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
      }
    };
  }, []);

  return <div ref={blocklyDiv} style={{ height: "500px", width: "100%" }}></div>;
};

export default BlocklyComponent;
