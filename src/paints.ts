export interface CarPaint {
  id: string;
  name: string;
  code: string;
  hex: string;
  metalness: number;
  roughness: number;
}
// BMW paint names/codes referenced against the BMW F90 brochure.
// Hex values are authored sRGB approximations, not manufacturer colorimetry.
export const carPaints: CarPaint[] = [
  {
    id: "alpine-white",
    name: "Alpine White III",
    code: "300",
    hex: "#e8e9e3",
    metalness: 0.12,
    roughness: 0.31,
  },
  {
    id: "black-sapphire",
    name: "Black Sapphire Metallic",
    code: "475",
    hex: "#20252b",
    metalness: 0.46,
    roughness: 0.3,
  },
  {
    id: "donington-grey",
    name: "Donington Grey Metallic",
    code: "C28",
    hex: "#898a83",
    metalness: 0.48,
    roughness: 0.33,
  },
  {
    id: "brilliant-white",
    name: "Brilliant White Metallic",
    code: "BMW Individual",
    hex: "#f4f3ed",
    metalness: 0.32,
    roughness: 0.28,
  },
  {
    id: "bluestone",
    name: "Bluestone Metallic",
    code: "C2Y",
    hex: "#768895",
    metalness: 0.48,
    roughness: 0.32,
  },
  {
    id: "tanzanite-blue",
    name: "Tanzanite Blue II Metallic",
    code: "C3Z",
    hex: "#203666",
    metalness: 0.43,
    roughness: 0.3,
  },
  {
    id: "snapper-rocks",
    name: "Snapper Rocks Blue Metallic",
    code: "C1G",
    hex: "#168c9e",
    metalness: 0.42,
    roughness: 0.31,
  },
  {
    id: "motegi-red",
    name: "Motegi Red Metallic",
    code: "C3K",
    hex: "#a52b35",
    metalness: 0.4,
    roughness: 0.31,
  },
  {
    id: "marina-bay",
    name: "Marina Bay Blue Metallic",
    code: "C1K",
    hex: "#145bb0",
    metalness: 0.43,
    roughness: 0.3,
  },
  {
    id: "aventurin-red",
    name: "Aventurin Red III Metallic",
    code: "C57",
    hex: "#662c36",
    metalness: 0.45,
    roughness: 0.32,
  },
  {
    id: "brands-hatch",
    name: "Brands Hatch Grey Metallic",
    code: "C17",
    hex: "#535c61",
    metalness: 0.48,
    roughness: 0.32,
  },
];
export function randomPaint(random = Math.random) {
  return carPaints[
    Math.min(carPaints.length - 1, Math.floor(random() * carPaints.length))
  ];
}
