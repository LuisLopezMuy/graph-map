import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FaHand } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";
import { TbRouteSquare2 } from "react-icons/tb";
import { FaMousePointer } from "react-icons/fa";
import { useMapPanel } from "../hooks";
import icon from "../resources/icon.svg";

export const MapPanel = () => {
  const {
    nodes,
    edgesForRender,
    selectedTool,
    selectedNodeId,
    selectedEdgeId,
    tempLine,
    tempMovingNodeId,
    setSelectedTool,
    handleMouseClickInSVG,
    handleMouseDownOnNode,
    handleMouseUpOnNode,
    handleMouseClickOnNode,
    handleMouseClickOnEdge,
    handleMouseMoveInSVG,
    handleMouseUpInSVG,
    handleRightClick,
  } = useMapPanel();

  return (
    <Stack sx={{ backgroundColor: "#e5e5e5ff", p: 2 }} spacing={2}>
      {/* Titulo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img src={icon} alt="Icon" width={70} height={70} />
        <Typography
          variant="h2"
          sx={{ fontFamily: "'Prosto One', sans-serif", fontWeight: 900 }}
        >
          Mapa de Ciudades
        </Typography>
      </Box>

      {/* Mapa */}
      <Stack>
        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonGroup
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 50 }}
          >
            <Tooltip title="Seleccionar" placement="top" arrow>
              <Button
                variant={selectedTool === "select" ? "contained" : "outlined"}
                color={selectedTool === "select" ? "primary" : "inherit"}
                sx={{
                  backgroundColor:
                    selectedTool === "select" ? "black" : "inherit",
                }}
                onClick={() => {
                  setSelectedTool("select");
                }}
              >
                <FaMousePointer size={22} />
              </Button>
            </Tooltip>

            <Tooltip title="Mover Ciudad" placement="top" arrow>
              <Button
                variant={selectedTool === "move" ? "contained" : "outlined"}
                color={selectedTool === "move" ? "primary" : "inherit"}
                sx={{
                  backgroundColor:
                    selectedTool === "move" ? "black" : "inherit",
                }}
                onClick={() => {
                  setSelectedTool("move");
                }}
              >
                <FaHand size={22} />
              </Button>
            </Tooltip>

            <Tooltip title="Nueva Ciudad" placement="top" arrow>
              <Button
                variant={selectedTool === "node" ? "contained" : "outlined"}
                color={selectedTool === "node" ? "primary" : "inherit"}
                sx={{
                  backgroundColor:
                    selectedTool === "node" ? "black" : "inherit",
                }}
                onClick={() => {
                  setSelectedTool("node");
                }}
              >
                <FaCity size={22} />
              </Button>
            </Tooltip>

            <Tooltip title="Nueva Ruta" placement="top" arrow>
              <Button
                variant={selectedTool === "edge" ? "contained" : "outlined"}
                color={selectedTool === "edge" ? "primary" : "inherit"}
                sx={{
                  backgroundColor:
                    selectedTool === "edge" ? "black" : "inherit",
                }}
                onClick={() => {
                  setSelectedTool("edge");
                }}
              >
                <TbRouteSquare2 size={22} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>

        {/* SVG de Mapa */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            cursor: () => {
              switch (selectedTool) {
                case "node":
                  return "crosshair";
                case "select":
                  return "default";
                default:
                  return "default";
              }
            },
          }}
        >
          <svg
            width="1400px"
            height="800px"
            style={{ backgroundColor: "#cfcfcfff" }}
            onClick={(e: React.MouseEvent<SVGSVGElement>) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - 25;
              const y = e.clientY - rect.top - 25;

              handleMouseClickInSVG(x, y);
            }}
            onMouseMove={(e: React.MouseEvent<SVGSVGElement>) => {
              if (!tempMovingNodeId && !tempLine) return;

              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - 25;
              const y = e.clientY - rect.top - 25;

              handleMouseMoveInSVG(x, y);
            }}
            onMouseUp={handleMouseUpInSVG}
            onMouseLeave={handleMouseUpInSVG}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {/* Fondo cuadriculado */}
            <defs>
              <pattern
                id="grid"
                width="70"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 70 0 L 0 0 0 80"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.20)"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {tempLine && (
              <line
                x1={tempLine.x1 + 25}
                y1={tempLine.y1 + 25}
                x2={tempLine.x2 + 25}
                y2={tempLine.y2 + 25}
                stroke="#000000ff"
                strokeWidth="5"
              />
            )}

            {/* Aristas */}
            {edgesForRender.map((edge) => {
              const midX = (edge.x1 + edge.x2) / 2 + 25;
              const midY = (edge.y1 + edge.y2) / 2 + 25;
              const labelWidth = String(edge.weight).length * 7 + 12;
              return (
                <g key={edge.id}>
                  {selectedEdgeId === edge.id && (
                    <line
                      x1={edge.x1 + 25}
                      y1={edge.y1 + 25}
                      x2={edge.x2 + 25}
                      y2={edge.y2 + 25}
                      stroke="#8400ffff"
                      strokeWidth="10"
                      strokeLinecap="round"
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  <line
                    onClick={() => {
                      handleMouseClickOnEdge(edge.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleRightClick("edge", edge.id);
                    }}
                    x1={edge.x1 + 25}
                    y1={edge.y1 + 25}
                    x2={edge.x2 + 25}
                    y2={edge.y2 + 25}
                    stroke={edge.color}
                    strokeWidth="5"
                  />

                  {/* Fondo para la etiqueta del peso */}
                  <rect
                    x={midX - labelWidth / 2}
                    y={midY - 10}
                    width={labelWidth}
                    height={20}
                    rx={10}
                    fill="white"
                    stroke="rgba(0, 0, 0, 0.15)"
                    strokeWidth="1"
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Texto del peso */}
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill="black"
                    style={{
                      fontFamily: "'Prosto One', sans-serif",
                      fontSize: "10px",
                      fontWeight: "bold",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodos */}
            {Object.entries(nodes).map(([id, node]) => {
              const labelWidth = node.cityName
                ? node.cityName.length * 7 + 30
                : 60;
              return (
                <g
                  key={id}
                  onClick={() => {
                    handleMouseClickOnNode(Number(id));
                  }}
                  onMouseDown={() => {
                    handleMouseDownOnNode(Number(id));
                  }}
                  onMouseUp={() => {
                    handleMouseUpOnNode(Number(id));
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleRightClick("node", Number(id));
                  }}
                  cursor={
                    selectedTool === "move"
                      ? "move"
                      : selectedTool === "edge"
                        ? "cell"
                        : selectedTool === "node"
                          ? "crosshair"
                          : "default"
                  }
                >
                  <circle
                    cx={node.x + 25}
                    cy={node.y + 25}
                    r={35}
                    fill="#dbdbdbff"
                    stroke={
                      selectedNodeId === Number(id) ? "#8400ffff" : "#dbdbdbff"
                    }
                    strokeWidth={5}
                  />
                  <FaCity
                    x={node.x}
                    y={node.y}
                    size={50}
                    style={{ backgroundColor: "white" }}
                    color={node.color}
                  />

                  {/* Fondo para contraste del Label */}
                  <rect
                    x={node.x + 25 - labelWidth / 2}
                    y={node.y + 61}
                    width={labelWidth}
                    height={20}
                    rx={10}
                    fill="white"
                    stroke="rgba(0, 0, 0, 0.15)"
                    strokeWidth="1"
                    style={{ pointerEvents: "none" }}
                  />

                  <text
                    x={node.x + 25}
                    y={node.y + 75}
                    textAnchor="middle"
                    fill="black"
                    style={{
                      fontFamily: "'Prosto One', sans-serif",
                      fontSize: "11px",
                      fontWeight: "bold",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {node.id + ". " + node.cityName}
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>
      </Stack>
    </Stack>
  );
};
