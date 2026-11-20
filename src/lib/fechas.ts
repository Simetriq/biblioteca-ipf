const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function sumarDias(desde: Date, dias: number): Date {
  return new Date(desde.getTime() + dias * MS_POR_DIA);
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function diasRestantes(iso: string, hoy: Date = new Date()): number {
  return Math.ceil((new Date(iso).getTime() - hoy.getTime()) / MS_POR_DIA);
}
