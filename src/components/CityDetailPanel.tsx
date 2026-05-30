import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useCityDetailPanel } from "../hooks";
import { AlgorithmTabs } from "./AlgorithmTabs";

export const CityDetailPanel = () => {
  const {
    loadExampleData,
    selectedNode,
    selectedEdge,
    updateNode,
    updateEdge,
  } = useCityDetailPanel();
  return (
    <Box sx={{ backgroundColor: "#cccccc", p: 2 }}>
      <Stack spacing={4}>
        {/* Boton para reiniciar ejemplo */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={loadExampleData}
          >
            Cargar Ejemplo
          </Button>
        </Box>

        <Box sx={{ minHeight: 340 }}>
          {/* Detalles de Ciudad */}
          {!selectedEdge && (
            <Stack spacing={1.3}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Prosto One', sans-serif", fontWeight: 900 }}
              >
                Detalles de Ciudad
              </Typography>
              <TextField
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={true}
                color="secondary"
                label="ID"
                variant="outlined"
                size="small"
                fullWidth
                value={selectedNode?.id ?? ""}
                slotProps={{
                  inputLabel: { shrink: !!selectedNode?.id },
                }}
              />

              <TextField
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={!selectedNode}
                color="secondary"
                label="Nombre"
                variant="outlined"
                size="small"
                fullWidth
                value={selectedNode?.cityName ?? ""}
                onChange={(e) => {
                  if (selectedNode) {
                    updateNode({
                      ...selectedNode,
                      cityName: e.target.value,
                    });
                  }
                }}
                slotProps={{
                  inputLabel: { shrink: !!selectedNode?.cityName },
                }}
              />
              <TextField
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={!selectedNode}
                color="secondary"
                label="Codigo"
                variant="outlined"
                size="small"
                fullWidth
                value={selectedNode?.cityCode ?? ""}
                onChange={(e) => {
                  if (selectedNode) {
                    updateNode({
                      ...selectedNode,
                      cityCode: e.target.value,
                    });
                  }
                }}
                slotProps={{
                  inputLabel: { shrink: !!selectedNode?.cityCode },
                }}
              />
              <TextField
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={!selectedNode}
                color="secondary"
                label="Departamento o Region"
                variant="outlined"
                size="small"
                fullWidth
                value={selectedNode?.cityDepartment ?? ""}
                onChange={(e) => {
                  if (selectedNode) {
                    updateNode({
                      ...selectedNode,
                      cityDepartment: e.target.value,
                    });
                  }
                }}
                slotProps={{
                  inputLabel: { shrink: !!selectedNode?.cityDepartment },
                }}
              />
              <TextField
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={!selectedNode}
                color="secondary"
                type="number"
                label="Poblacion"
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={selectedNode?.cityPopulation ?? 0}
                onChange={(e) => {
                  if (selectedNode) {
                    const parsed = parseInt(e.target.value);
                    updateNode({
                      ...selectedNode,
                      cityPopulation: isNaN(parsed) || parsed < 0 ? 0 : parsed,
                    });
                  }
                }}
              />
              <MuiColorInput
                sx={{ backgroundColor: "#d3d3d3ff" }}
                disabled={!selectedNode}
                color="secondary"
                label="Color"
                variant="outlined"
                size="small"
                format="hex8"
                fullWidth
                value={selectedNode?.color ?? "#ccccccff"}
                onChange={(color) => {
                  if (selectedNode && selectedNode.color !== color) {
                    updateNode({
                      ...selectedNode,
                      color,
                    });
                  }
                }}
              />
            </Stack>
          )}

          {/* Detalles de Ruta */}
          {selectedEdge && (
            <Stack spacing={1.3}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Prosto One', sans-serif", fontWeight: 900 }}
              >
                Detalles de Ruta
              </Typography>
              <TextField
                disabled={!selectedEdge}
                sx={{ backgroundColor: "#d3d3d3ff" }}
                color="secondary"
                type="number"
                label="Distancia (km)"
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={selectedEdge?.weight ?? 0}
                onChange={(e) => {
                  if (selectedEdge) {
                    const parsed = parseInt(e.target.value);
                    updateEdge({
                      ...selectedEdge,
                      weight: isNaN(parsed) || parsed < 0 ? 0 : parsed,
                    });
                  }
                }}
              />
              <MuiColorInput
                disabled={!selectedEdge}
                sx={{ backgroundColor: "#d3d3d3ff" }}
                color="secondary"
                label="Color"
                variant="outlined"
                size="small"
                format="hex8"
                fullWidth
                value={selectedEdge?.color ?? "#ccccccff"}
                onChange={(color) => {
                  if (selectedEdge && selectedEdge.color !== color) {
                    updateEdge({
                      ...selectedEdge,
                      color,
                    });
                  }
                }}
              />
            </Stack>
          )}
        </Box>

        <AlgorithmTabs />
      </Stack>
    </Box>
  );
};
