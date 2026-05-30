import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box, { type BoxProps } from "@mui/material/Box";
import {
  useGetAdjacencyList,
  useGetAdjacencyMatrix,
  useGetBFS,
  useGetDFS,
  useGetShortestRoute,
} from "../hooks";

// TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  other?: BoxProps;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
};

export const AlgorithmTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Lista de Adyacencia
  const { adjacencyList } = useGetAdjacencyList();
  // Matriz de Adyacencia
  const { adjacencyMatrix } = useGetAdjacencyMatrix();
  // BFS
  //   const { bfs } = useGetBFS();
  // DFS
  //   const { dfs } = useGetDFS();
  // Ruta mas corta
  //   const { shortestRoute } = useGetShortestRoute();

  return (
    <Box
      sx={{ height: 455, backgroundColor: "#d4d4d4ff", p: 2, borderRadius: 2 }}
    >
      {/* Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="scrollable auto tabs example"
        sx={{
          "& .MuiTab-root": {
            minWidth: "auto",
            px: 1.7,
            fontWeight: 600,
          },
        }}
      >
        <Tab label="Lista" />
        <Tab label="Matriz" />
        <Tab label="BFS" />
        <Tab label="DFS" />
        <Tab label="Ruta mas corta" sx={{ px: "8px !important" }} />
      </Tabs>

      {/* Lista de Adyacencia */}
      <TabPanel value={value} index={0}>
        {Object.entries(adjacencyList).map(([id, node]) => (
          <div key={id}>
            <p>
              <span>{node.cityName}</span>
              <span> = </span>
              <span>
                [
                {Object.entries(node.conections).map(([targetId, conection]) => (
                  <span key={targetId}>
                    ({conection.toCityName}
                    {", "}
                    <span>{conection.weight}</span>){", "}
                  </span>
                ))}
                ]
              </span>
            </p>
          </div>
        ))}
      </TabPanel>

      {/* Matriz de Adyacencia */}
      <TabPanel value={value} index={1}></TabPanel>

      {/* BFS */}
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>

      {/* DFS */}
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>

      {/* Ruta mas corta */}
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
    </Box>
  );
};

