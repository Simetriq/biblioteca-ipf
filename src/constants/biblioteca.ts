// Reglas del negocio de la biblioteca, en un solo lugar.
export const DIAS_PRESTAMO = 7;
export const SEGUNDOS_RECORDATORIO_DEMO = 15;
export const CANTIDAD_RECIENTES = 3;
export const DEMORA_BUSQUEDA_MS = 300;
export const PAUSA_TRAS_ISBN_DESCONOCIDO_MS = 2500;

// Nombre con el que la persona que usa la app aparece en las listas de espera.
export const YO = 'Vos';

// Credenciales fijas del personal (consigna: fijas en el código).
export const CREDENCIALES_PERSONAL = {
  usuario: 'biblioteca',
  clave: 'ipf2026',
} as const;

export const CANAL_PRESTAMOS = 'prestamos';

export const CLAVE_ALMACENAMIENTO = 'biblioteca-ipf/estado-v1';
