import { useMemo } from "react";
import { useStore } from "../../zustand";

type AdjacencyMatrix = Record<
  number,
  {
    cityName: string;
    conections: Record<
      number,
      {
        toCityName: string;
        weight: number;
      }
    >;
  }
>;

export const useGetAdjacencyMatrix = (): {
  adjacencyMatrix: AdjacencyMatrix;
} => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const adjacencyMatrix: AdjacencyMatrix = useMemo(() => {
    const matrix: AdjacencyMatrix = {};
    Object.entries(nodes).forEach(([, node]) => {
      matrix[node.id] = { cityName: node.cityName, conections: {} };
    });
    edges.forEach((edge) => {
      matrix[edge.fromNodeId].conections[edge.toNodeId] = {
        toCityName: nodes[edge.toNodeId].cityName,
        weight: edge.weight,
      };
      matrix[edge.toNodeId].conections[edge.fromNodeId] = {
        toCityName: nodes[edge.fromNodeId].cityName,
        weight: edge.weight,
      };
    });
    return matrix;
  }, [nodes, edges]);

  return { adjacencyMatrix: adjacencyMatrix };
};
