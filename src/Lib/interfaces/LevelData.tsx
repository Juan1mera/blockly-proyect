import * as Blockly from 'blockly/core';

export interface BlocklyWorkspaceRef {
  getWorkspaceState: () => Blockly.WorkspaceSvg | null;
}

export interface BlocklyWorkspaceProps {
  workspaceId: string;
  initialState?: any;
  toolbox?: any;
  onWorkspaceChange?: (state: any) => void;
  onExecute?: (commands: string[]) => Promise<void>;
  onWorkspaceReady?: (workspace: Blockly.WorkspaceSvg) => void; 
}

export interface LevelData {
  numeroNivel: number;
  mapa: string;
  bloquesUsados: any;
  cantidadBloques: number;
}