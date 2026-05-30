import type { NodeModel } from "../../models";
import { useStore } from "../../zustand";

export const useGetBFS = () => {
  // Se obtienen datos desde el Store
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const selectedNodeId = useStore((state) => state.selectedNodeId);

  // Texto acumulado para mostrar pasos
  let bfsResultText = "";

  // Cola de pendientes
  const queue: NodeModel[] = [];
  // Lista de ids de nodos visitados
  const visited: number[] = [];

  if (selectedNodeId === null) return { bfsResultText: "Selecciona un nodo" };

  bfsResultText +=
    "Se inicia desde el nodo: " + nodes[selectedNodeId].cityName + "\n\n";
  bfsResultText +=
    "   Se marca como visitado: " + nodes[selectedNodeId].cityName + "\n";
  visited.push(nodes[selectedNodeId].id);
  bfsResultText +=
    "   Se agrega a la cola: " + nodes[selectedNodeId].cityName + "\n\n";
  queue.push(nodes[selectedNodeId]);

  const bfs = () => {
    const currentNode = queue.shift();
    bfsResultText += "Se procesa el nodo: " + currentNode?.cityName + "\n";

    for (const edge of edges) {
      // Se comprueba nodo destino
      if (
        edge.fromNodeId === currentNode?.id &&
        !visited.includes(edge.toNodeId)
      ) {
        const newNode = nodes[edge.toNodeId];
        bfsResultText +=
          "   Se marca como visitado: " + newNode.cityName + "\n";
        visited.push(newNode.id);
        bfsResultText += "   Se agrega a la cola: " + newNode.cityName + "\n";
        queue.push(newNode);
      }
      // Se comprueba nodo origen
      if (
        edge.toNodeId === currentNode?.id &&
        !visited.includes(edge.fromNodeId)
      ) {
        const newNode = nodes[edge.fromNodeId];
        bfsResultText +=
          "   Se marca como visitado: " + newNode.cityName + "\n";
        visited.push(newNode.id);
        bfsResultText += "   Se agrega a la cola: " + newNode.cityName + "\n";
        queue.push(newNode);
      }
    }
    bfsResultText += "\n";

    // Se comprueba si quedan nodos en la cola, si es asi se vuelve a llamar a la funcion
    if (queue.length > 0) {
      bfs();
    } else {
      bfsResultText += "\nSe ha recorrido todo el grafo";
    }
  };
  bfs();

  return {
    bfsResultText,
  };
};
