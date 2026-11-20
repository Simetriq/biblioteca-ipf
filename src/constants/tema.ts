import { Platform, StyleSheet } from 'react-native';

// Estilo "librería": fondo blanco, rojo coral como color de marca,
// grises suaves para separar secciones y títulos en mayúscula.
export const colores = {
  fondo: '#FFFFFF',
  superficie: '#F4F4F2',
  blanco: '#FFFFFF',
  texto: '#1C1C1C',
  textoSuave: '#666666',
  textoTenue: '#9C9C9C',
  primario: '#E4573D',
  primarioOscuro: '#C4432C',
  primarioClaro: '#FDECE7',
  acento: '#E9A0A0',
  acentoClaro: '#FBEAEA',
  alerta: '#B83227',
  alertaClara: '#F8E1DE',
  borde: '#E6E6E6',
  sombra: '#000000',
  lomoSombra: 'rgba(0,0,0,0.15)',
  heroVelo: 'rgba(0,0,0,0.68)',
  heroFondo: '#2B2B2B',
  camaraFondo: '#111111',
} as const;

// Tapas: cada libro toma un par fondo/texto según su posición en el catálogo.
export const coloresTapa = [
  { fondo: '#F4C7C3', texto: '#1C1C1C' },
  { fondo: '#3E6FD8', texto: '#FFFFFF' },
  { fondo: '#2BB3B1', texto: '#FFFFFF' },
  { fondo: '#F2E6D0', texto: '#1C1C1C' },
  { fondo: '#1C1C1C', texto: '#FFFFFF' },
  { fondo: '#E4573D', texto: '#FFFFFF' },
  { fondo: '#F5B841', texto: '#1C1C1C' },
  { fondo: '#7A5C99', texto: '#FFFFFF' },
] as const;

// Un estilo por par de colores: las tapas no usan estilos en línea.
export const estilosTapa = coloresTapa.map((color) =>
  StyleSheet.create({
    fondo: { backgroundColor: color.fondo },
    texto: { color: color.texto },
  }),
);

// Las familias Montserrat se cargan en NavegacionRaiz con useFonts.
export const fuentes = {
  regular: 'Montserrat_400Regular',
  media: 'Montserrat_500Medium',
  semi: 'Montserrat_600SemiBold',
  negrita: 'Montserrat_700Bold',
  extra: 'Montserrat_800ExtraBold',
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const tamanios = {
  diminuto: 9,
  mini: 11,
  chico: 13,
  base: 15,
  medio: 17,
  grande: 20,
  titulo: 26,
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
  s: 2,
  m: 4,
  l: 8,
  pastilla: 999,
} as const;

export const medidas = {
  areaTactil: 44,
  portadaChica: { ancho: 52, alto: 76 },
  portadaMedia: { ancho: 92, alto: 132 },
  portadaTarjeta: { ancho: 96, alto: 140 },
  portadaGrande: { ancho: 150, alto: 216 },
  lomo: 5,
  visor: 240,
  borde: 1,
  marca: { ancho: 28, alto: 3 },
  hero: 210,
  lomoEstante: { ancho: 14, altoMin: 46 },
} as const;

export const iconos = {
  chico: 16,
  medio: 18,
  grande: 20,
  enorme: 22,
} as const;

export const letras = {
  ancho: 0.6,
  amplio: 1.2,
} as const;

export const sombras = {
  tarjeta: {
    shadowColor: colores.sombra,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;
