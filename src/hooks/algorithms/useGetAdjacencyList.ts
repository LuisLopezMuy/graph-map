import { useMemo } from "react";
import { useStore } from "../../zustand";

type AdjacencyList = Record<
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

export const useGetAdjacencyList = (): { adjacencyList: AdjacencyList } => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const adjacencyList: AdjacencyList = useMemo(() => {
    const list: AdjacencyList = {};
    Object.entries(nodes).forEach(([, node]) => {
      list[node.id] = { cityName: node.cityName, conections: {} };
    });
    edges.forEach((edge) => {
      list[edge.fromNodeId].conections[edge.toNodeId] = {
        toCityName: nodes[edge.toNodeId].cityName,
        weight: edge.weight,
      };
      list[edge.toNodeId].conections[edge.fromNodeId] = {
        toCityName: nodes[edge.fromNodeId].cityName,
        weight: edge.weight,
      };
    });
    return list;
  }, [nodes, edges]);

  return { adjacencyList };
};
