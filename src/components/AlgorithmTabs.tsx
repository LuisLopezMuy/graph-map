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
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
      sx={{
        display: value === index ? "flex" : "none",
        flex: 1,
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1, flex: 1, minHeight: 0, overflowY: "auto" }}>
          {children}
        </Box>
      )}
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
  const { adjacencyMatrix, matrixNodeOrder } = useGetAdjacencyMatrix();
  // BFS
  const { bfsResultText } = useGetBFS();
  // DFS
  const { dfsResultText } = useGetDFS();
  // Ruta mas corta
  //   const { shortestRoute } = useGetShortestRoute();

  return (
    <Box
      sx={{
        height: 455,
        backgroundColor: "#d4d4d4ff",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
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
        <Box>
          {Object.entries(adjacencyList).map(([id, node]) => (
            <Box key={id} sx={{ py: 1 }}>
              <Typography variant="body2">
                <span style={{ fontWeight: "bold" }}>{node.cityName}</span>
                <span> = </span>
                <span>
                  [
                  {Object.entries(node.conections).map(
                    ([targetId, conection]) => (
                      <span key={targetId}>
                        ({conection.toCityName}
                        {", "}
                        <span>{conection.weight}</span>){", "}
                      </span>
                    ),
                  )}
                  ]
                </span>
              </Typography>
            </Box>
          ))}
        </Box>
      </TabPanel>

      {/* Matriz de Adyacencia */}
      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Matriz de Adyacencia">
            <TableHead>
              <TableRow>
                <TableCell key={""}></TableCell>
                {matrixNodeOrder.map((key) => (
                  <TableCell key={key} sx={{ fontWeight: 700 }}>
                    {adjacencyMatrix[key].cityName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {matrixNodeOrder.map((key) => (
                <TableRow key={key}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: 700 }}
                  >
                    {adjacencyMatrix[key].cityName}
                  </TableCell>
                  {matrixNodeOrder.map((targetId) => (
                    <TableCell key={targetId} align="right">
                      {adjacencyMatrix[key].conections[targetId]?.weight ?? "0"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* BFS */}
      <TabPanel value={value} index={2}>
        <pre>{bfsResultText}</pre>
      </TabPanel>

      {/* DFS */}
      <TabPanel value={value} index={3}>
        <pre>{dfsResultText}</pre>
      </TabPanel>

      {/* Ruta mas corta */}
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
    </Box>
  );
};
