import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NodeModel, EdgeModel } from "../models";

type ToolSelected = "select" | "move" | "node" | "edge";

type Store = {
  nodes: Record<number, NodeModel>;
  edges: EdgeModel[];
  lastNodeId: number;
  lastEdgeId: number;

  selectedNodeId: number | null;
  selectedEdgeId: number | null;

  selectedTool: ToolSelected;

  setNodes: (nodes: Record<number, NodeModel>) => void;
  setLastNodeId: (id: number) => void;
  addNode: (node: NodeModel) => void;
  updateNode: (node: NodeModel) => void;
  deleteNode: (id: number) => void;
  setEdges: (edges: EdgeModel[]) => void;
  setLastEdgeId: (id: number) => void;
  addEdge: (edge: EdgeModel) => void;
  updateEdge: (edge: EdgeModel) => void;
  deleteEdge: (id: number) => void;
  setSelectedNodeId: (id: number | null) => void;
  setSelectedEdgeId: (id: number | null) => void;
  setSelectedTool: (tool: ToolSelected) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      nodes: {},
      edges: [],
      lastNodeId: 0,
      lastEdgeId: 0,

      selectedNodeId: null,
      selectedEdgeId: null,

      selectedTool: "select",

      setNodes: (nodes: Record<number, NodeModel>) => set({ nodes }),
      setLastNodeId: (id: number) => set({ lastNodeId: id }),
      addNode: (node: NodeModel) =>
        set(({ nodes, lastNodeId }) => ({
          nodes: {
            ...nodes,
            [lastNodeId + 1]: { ...node, id: lastNodeId + 1 },
          },
          selectedNodeId: lastNodeId + 1,
          selectedEdgeId: null,
          lastNodeId: lastNodeId + 1,
        })),
      updateNode: (node: NodeModel) =>
        set(({ nodes }) => ({
          nodes: { ...nodes, [node.id]: node },
        })),
      deleteNode: (id: number) =>
        set(({ nodes, selectedNodeId, edges, selectedEdgeId }) => ({
          nodes: Object.fromEntries(
            Object.entries(nodes).filter(([key]) => Number(key) !== id),
          ),
          edges: edges.filter((e) => e.fromNodeId !== id && e.toNodeId !== id),
          selectedNodeId: id === selectedNodeId ? null : selectedNodeId,
          selectedEdgeId: id === selectedEdgeId ? null : selectedEdgeId,
        })),

      setEdges: (edges: EdgeModel[]) => set({ edges }),
      setLastEdgeId: (id: number) => set({ lastEdgeId: id }),
      addEdge: (edge: EdgeModel) =>
        set(({ edges, lastEdgeId }) => ({
          edges: [...edges, { ...edge, id: lastEdgeId + 1 }],
          selectedEdgeId: lastEdgeId + 1,
          selectedNodeId: null,
          lastEdgeId: lastEdgeId + 1,
        })),
      updateEdge: (edge: EdgeModel) =>
        set(({ edges }) => ({
          edges: edges.map((e) => (e.id === edge.id ? edge : e)),
        })),
      deleteEdge: (id: number) =>
        set(({ edges, selectedEdgeId }) => ({
          edges: edges.filter((e) => e.id !== id),
          selectedEdgeId: id === selectedEdgeId ? null : selectedEdgeId,
        })),

      setSelectedNodeId: (id: number | null) =>
        set({ selectedNodeId: id, selectedEdgeId: null }),
      setSelectedEdgeId: (id: number | null) =>
        set({ selectedEdgeId: id, selectedNodeId: null }),
      setSelectedTool: (tool: ToolSelected) => set({ selectedTool: tool }),
    }),
    {
      name: "graph-map",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        lastNodeId: state.lastNodeId,
        lastEdgeId: state.lastEdgeId,
      }),
    },
  ),
);
