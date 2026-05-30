export interface EdgeModel {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  weight: number;
  color: string;
}

export function createBaseEdgeModel(fromNodeId: number, toNodeId: number): EdgeModel {
  return {
    id: 0,
    fromNodeId,
    toNodeId,
    weight: 100,
    color: "#000000",
  };
}

export interface EdgeRenderModel {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  weight: number;
}
