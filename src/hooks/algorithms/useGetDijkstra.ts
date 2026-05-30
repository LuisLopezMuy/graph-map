import { useMemo, useState } from "react";
import { useStore } from "../../zustand";

type AutoCompleteOption = {
  id: number;
  cityName: string;
};

type DijkstraNode = {
  id: number;
  distanceFromOrigin: number;
  visited: boolean;
  lastNodeId: number | null;
};

type DijkstraResultModel = {
  destinationId: number; // 💡 Agregado para poder hacer el findIndex de forma segura
  distance: number;
  nodes: { id: number; cityName: string }[];
};

export const useGetDijkstra = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [fromValue, setFromValue] = useState<AutoCompleteOption | null>(null);
  const [toValue, setToValue] = useState<AutoCompleteOption | null>(null);
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResultModel | null>(null);

  // 💡 Ahora recibe los parámetros directamente para evitar el retraso del estado de React
  const runDijkstra = (from: AutoCompleteOption, to: AutoCompleteOption) => {
    // Se inicializa el record de nodos
    const dijkstraNodes: Record<number, DijkstraNode> = {};

    Object.values(nodes).forEach((node) => {
      dijkstraNodes[node.id] = {
        id: node.id,
        distanceFromOrigin: Infinity,
        visited: false,
        lastNodeId: null,
      };
    });

    dijkstraNodes[from.id].distanceFromOrigin = 0;

    while (true) {
      // 2. Buscamos el nodo no visitado con la menor distancia
      const unvisitedNodes = Object.values(dijkstraNodes).filter(
        (node) => !node.visited,
      );

      // Si ya visitamos todos, terminamos
      if (unvisitedNodes.length === 0) break;

      // Ordenamos para obtener el más cercano
      const currentNode = unvisitedNodes.sort(
        (a, b) => a.distanceFromOrigin - b.distanceFromOrigin,
      )[0];

      // 3. SEGURIDAD: Si el más cercano está a infinito, los demás son inalcanzables
      if (currentNode.distanceFromOrigin === Infinity) break;

      currentNode.visited = true;

      // Se recorren los nodos adyacentes, en caso de que tenga una distancia menor, se actualiza
      for (const edge of edges) {
        if (edge.fromNodeId === currentNode.id) {
          const targetNode = dijkstraNodes[edge.toNodeId];
          // 💡 Verificación de seguridad para TypeScript
          if (targetNode && !targetNode.visited) {
            const newDistance = currentNode.distanceFromOrigin + edge.weight;
            if (newDistance < targetNode.distanceFromOrigin) {
              targetNode.distanceFromOrigin = newDistance;
              targetNode.lastNodeId = currentNode.id;
            }
          }
        }

        if (edge.toNodeId === currentNode.id) {
          const targetNode = dijkstraNodes[edge.fromNodeId];
          // 💡 Verificación de seguridad para TypeScript
          if (targetNode && !targetNode.visited) {
            const newDistance = currentNode.distanceFromOrigin + edge.weight;
            if (newDistance < targetNode.distanceFromOrigin) {
              targetNode.distanceFromOrigin = newDistance;
              targetNode.lastNodeId = currentNode.id;
            }
          }
        }
      }
    }

    // Si el destino final es inalcanzable, no intentamos reconstruir la ruta
    if (dijkstraNodes[to.id].distanceFromOrigin === Infinity) return;

    // Reconstruir el camino
    const path: DijkstraResultModel = {
      destinationId: to.id, // Guardamos la referencia
      distance: dijkstraNodes[to.id].distanceFromOrigin,
      nodes: [],
    };

    let currentNodeId: number | null = to.id;
    while (currentNodeId !== null) {
      const node = nodes[currentNodeId];
      if (!node) break; // Seguridad en caso de datos corruptos

      path.nodes.unshift({
        id: node.id,
        cityName: node.id + ". " +node.cityName,
      });
      currentNodeId = dijkstraNodes[currentNodeId].lastNodeId;
    }

    // Reemplaza todo el bloque de setDijkstraResult con el findIndex por esta única línea:
    setDijkstraResult(path);
  };

  const autocompleteOptions: AutoCompleteOption[] = useMemo(() => {
    return Object.values(nodes).map((node) => ({
      id: node.id,
      cityName: node.id + ". " + node.cityName,
    }));
  }, [nodes]);

  const handleFromValueChange = (value: AutoCompleteOption | null) => {
    setFromValue(value);
    // 💡 Enviamos el 'value' recién llegado y el 'toValue' actual
    if (value && toValue) runDijkstra(value, toValue);
  };

  const handleToValueChange = (value: AutoCompleteOption | null) => {
    setToValue(value);
    // 💡 Enviamos el 'fromValue' actual y el 'value' recién llegado
    if (fromValue && value) runDijkstra(fromValue, value);
  };

  return {
    autocompleteOptions,
    fromValue,
    handleFromValueChange,
    toValue,
    handleToValueChange,
    dijkstraResult,
  };
};
