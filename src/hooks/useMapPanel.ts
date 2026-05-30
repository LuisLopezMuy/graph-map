import { useCallback, useMemo, useState } from "react";
import { useStore } from "../zustand";
import {
  createBaseEdgeModel,
  createBaseNodeModel,
  type EdgeRenderModel,
} from "../models";

export function useMapPanel() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const selectedTool = useStore((state) => state.selectedTool);
  const selectedNodeId = useStore((state) => state.selectedNodeId);
  const selectedEdgeId = useStore((state) => state.selectedEdgeId);
  const setSelectedTool = useStore((state) => state.setSelectedTool);
  const addNode = useStore((state) => state.addNode);
  const addEdge = useStore((state) => state.addEdge);
  const updateNode = useStore((state) => state.updateNode);
  const setSelectedNodeId = useStore((state) => state.setSelectedNodeId);
  const setSelectedEdgeId = useStore((state) => state.setSelectedEdgeId);
  const deleteNode = useStore((state) => state.deleteNode);
  const deleteEdge = useStore((state) => state.deleteEdge);

  const edgesForRender = useMemo<EdgeRenderModel[]>(() => {
    return edges.map((edge) => ({
      id: edge.id,
      x1: nodes[edge.fromNodeId]?.x,
      y1: nodes[edge.fromNodeId]?.y,
      x2: nodes[edge.toNodeId]?.x,
      y2: nodes[edge.toNodeId]?.y,
      color: edge.color,
      weight: edge.weight,
    }));
  }, [edges, nodes]);

  const handleMouseClickInSVG = (x: number, y: number) => {
    if (selectedTool === "node") {
      addNode(createBaseNodeModel(x, y));
    }
  };

  const handleMouseClickOnNode = (id: number) => {
    if (selectedTool === "select") {
      setSelectedNodeId(id);
    }
  };

  const handleMouseClickOnEdge = (id: number) => {
    if (selectedTool === "select") {
      setSelectedEdgeId(id);
    }
  };

  type TempLine = {
    fromNodeId: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  const [tempLine, setTempLine] = useState<TempLine | null>(null);
  const [tempMovingNodeId, setTempMovingNodeId] = useState<number | null>(null);

  const handleMouseDownOnNode = (id: number) => {
    switch (selectedTool) {
      case "edge":
        setTempLine(
            {
                fromNodeId: id,
                x1: nodes[id].x,
                y1: nodes[id].y,
                x2: nodes[id].x,
                y2: nodes[id].y,
            }
        );
        break;
      case "move":
        setTempMovingNodeId(id);
        break;
      default:
        break;
    }
  };

  const handleMouseUpOnNode = (id: number) => {
    switch (selectedTool) {
      case "edge":
        if (
          tempLine !== null &&
          id !== tempLine.fromNodeId &&
          !edges.some(
            (e) =>
              (e.fromNodeId === tempLine.fromNodeId && e.toNodeId === id) ||
              (e.fromNodeId === id && e.toNodeId === tempLine.fromNodeId),
          )
        ) {
          addEdge(createBaseEdgeModel(tempLine.fromNodeId, id));
        }
        setTempLine(null);
        break;
      default:
        break;
    }
  };

  const handleMouseMoveInSVG = useCallback(
    (x: number, y: number) => {
      if (tempMovingNodeId) {
        const node = useStore.getState().nodes[tempMovingNodeId];
        if (!node) return;
        updateNode({ ...node, x, y });
      } else if (tempLine) {
        setTempLine((prev) => (prev ? { ...prev, x2: x, y2: y } : null));
      }
    },
    [tempMovingNodeId, tempLine, updateNode],
  );

  const handleMouseUpInSVG = () => {
    setTempMovingNodeId(null);
    setTempLine(null);
  };

  const handleRightClick = (type: 'node' | 'edge', id: number) => {
    if (type === 'node') {
      deleteNode(id);
    } else {
      deleteEdge(id);
    }
  };

  return {
    nodes,
    edgesForRender,
    selectedTool,
    selectedNodeId,
    selectedEdgeId,
    tempLine,
    tempMovingNodeId,
    setSelectedTool,
    handleMouseClickInSVG,
    handleMouseDownOnNode,
    handleMouseUpOnNode,
    handleMouseClickOnNode,
    handleMouseClickOnEdge,
    handleMouseMoveInSVG,
    handleMouseUpInSVG,
    handleRightClick,
  };
}
