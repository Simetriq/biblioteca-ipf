import { Platform } from 'react-native';

// Paleta "papel y tinta": fondo de hoja vieja, tinta verde oscura y acentos
// tomados de los lomos de libros (ocre, terracota). Nada de degradés.
export const colores = {
  papel: '#F3EDE2',
  papelHondo: '#E9E0D0',
  hoja: '#FBF8F2',
  tinta: '#1E2B24',
  tintaSuave: '#5E6862',
  tintaTenue: '#8E948F',
  bosque: '#24493A',
  bosqueClaro: '#DCE5DD',
  ocre: '#C98B2B',
  ocreClaro: '#F2E3C4',
  terracota: '#B4532A',
  terracotaClara: '#F3DDD1',
  linea: '#D9CDB9',
  blanco: '#FFFFFF',
  camaraFondo: '#111511',
} as const;

// Colores de tapa: cada libro toma uno según su ISBN.
export const coloresTapa = [
  '#24493A',
  '#B4532A',
  '#C98B2B',
  '#2F4858',
  '#7A3B3B',
  '#5E6B3A',
  '#3D3A5C',
  '#8A5A2B',
] as const;

export const fuentes = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const tamanios = {
  mini: 11,
  chico: 13,
  base: 15,
  medio: 17,
  grande: 22,
  titulo: 28,
  portada: 34,
} as const;

export const espacios = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radios = {
  s: 3,
  m: 8,
  l: 14,
  pastilla: 999,
} as const;

export const medidas = {
  areaTactil: 44,
  portadaChica: { ancho: 52, alto: 76 },
  portadaMedia: { ancho: 92, alto: 132 },
  portadaGrande: { ancho: 150, alto: 216 },
  lomo: 6,
  visor: 240,
  borde: 1,
  marca: { ancho: 28, alto: 3 },
} as const;

export const iconos = {
  chico: 16,
  medio: 18,
  grande: 20,
  enorme: 22,
} as const;
