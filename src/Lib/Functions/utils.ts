import * as Blockly from 'blockly/core';
import { LevelData } from '../interfaces/LevelData';

export const saveWorkspaceState = (workspace: Blockly.WorkspaceSvg | null): any => {
  if (!workspace) return null;
  try {
    return Blockly.serialization.workspaces.save(workspace);
  } catch (error) {
    console.error("Error saving workspace state:", error);
    return null;
  }
};

export const loadWorkspaceState = (workspace: Blockly.WorkspaceSvg | null, state: any): void => {
  if (!workspace || !state) return;
  try {
    workspace.clear();
    Blockly.serialization.workspaces.load(state, workspace);
  } catch (error) {
    console.error("Error loading workspace state:", error);
  }
};

export const countBlocks = (workspace: Blockly.WorkspaceSvg | null): number => {
  if (!workspace) return 0;
  const blocks = workspace.getAllBlocks(false); // false para no contar bloques sombra
  console.log("Bloques contados:", blocks);
  return blocks.length;
};

export const saveLevelData = (levelNumber: number, gridData: string, workspace: Blockly.WorkspaceSvg | null): LevelData | null => {
  const workspaceState = saveWorkspaceState(workspace);
  if (!workspaceState) return null;

  const levelData: LevelData = {
    numeroNivel: levelNumber,
    mapa: gridData,
    bloquesUsados: workspaceState,
    cantidadBloques: countBlocks(workspace),
  };

  localStorage.setItem(`level_${levelNumber}_gridData`, gridData);
  localStorage.setItem(`level_${levelNumber}_workspaceState`, JSON.stringify(workspaceState));
  localStorage.setItem(`level_${levelNumber}`, JSON.stringify(levelData));

  return levelData;
};

export const loadLevelData = (levelNumber: number): LevelData | null => {
  const storedData = localStorage.getItem(`level_${levelNumber}`);
  if (!storedData) return null;

  try {
    const levelData: LevelData = JSON.parse(storedData);
    return levelData;
  } catch (error) {
    console.warn("Error parsing level data:", error);
    return null;
  }
};

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));