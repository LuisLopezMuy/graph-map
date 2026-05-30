import exampleNodes from "../resources/exampleNodes.json";
import exampleEdges from "../resources/exampleEdges.json";
import { useStore } from "../zustand";

export function useCityDetailPanel() {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const setLastNodeId = useStore((state) => state.setLastNodeId);
  const setLastEdgeId = useStore((state) => state.setLastEdgeId);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const selectedNodeId = useStore((state) => state.selectedNodeId);
  const selectedEdgeId = useStore((state) => state.selectedEdgeId);
  const updateNode = useStore((state) => state.updateNode);
  const updateEdge = useStore((state) => state.updateEdge);

  const loadExampleData = () => {
    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setLastNodeId(Object.keys(exampleNodes).length);
    setLastEdgeId(exampleEdges.length);
  };

  const selectedNode = selectedNodeId !== null ? nodes[selectedNodeId] : undefined;
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);

  return {
    loadExampleData,
    selectedNode,
    selectedEdge,
    updateNode,
    updateEdge,
  };
}
