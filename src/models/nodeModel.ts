export interface NodeModel {
  id: number;
  x: number;
  y: number;
  color: string;
  cityCode: string;
  cityName: string;
  cityDepartment: string;
  cityPopulation: number;
}

export function createBaseNodeModel(x: number, y: number): NodeModel {
  return {
    id: 0,
    x,
    y,
    color: "#000000",
    cityCode: "GT",
    cityName: "Nueva Ciudad",
    cityDepartment: "Guatemala",
    cityPopulation: 10000,
  };
}
