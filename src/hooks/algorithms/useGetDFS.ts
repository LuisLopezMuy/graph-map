import type { NodeModel } from "../../models";
import { useStore } from "../../zustand";

export const useGetDFS = () => {
  // Se obtienen datos desde el Store
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const selectedNodeId = useStore((state) => state.selectedNodeId);

  // Texto acumulado para mostrar pasos
  let dfsResultText = "";

  // Lista de ids de nodos visitados
  const visited: number[] = [];

  if (selectedNodeId === null) return { dfsResultText: "Selecciona un nodo" };

  dfsResultText +=
    "Se inicia desde el nodo: " + nodes[selectedNodeId].cityName + "\n\n";

  const dfs = (currentNode: NodeModel, spacing: string = "") => {
    dfsResultText +=
      spacing + "Se marca como visitado: " + nodes[currentNode?.id].cityName + "\n";
    visited.push(nodes[currentNode?.id].id);
    dfsResultText += spacing + "Se validan nodos vecinos\n";

    for (const edge of edges) {
      // Se comprueba nodo destino
      if (
        edge.fromNodeId === currentNode?.id &&
        !visited.includes(edge.toNodeId)
      ) {
        dfs(nodes[edge.toNodeId], spacing + "   ");
      }
      // Se comprueba nodo origen
      if (
        edge.toNodeId === currentNode?.id &&
        !visited.includes(edge.fromNodeId)
      ) {
        dfs(nodes[edge.fromNodeId], spacing + "   ");
      }
    }
  };

  // Primera llamada a la funcion
  dfs(nodes[selectedNodeId], "");

  dfsResultText += "\nSe ha recorrido todo el grafo";

  return {
    dfsResultText,
  };
};
