import { coloresTapa } from '../constants/tema';
import { LIBROS } from '../data/libros';
import type { Libro, Prestamo } from '../types';

// Búsqueda local y síncrona: la usan pantallas que solo necesitan
// un libro puntual (detalle, reserva, escáner, mostrador).
export function buscarLibroPorIsbn(isbn: string): Libro | undefined {
  return LIBROS.find((libro) => libro.isbn === isbn);
}

export function librosConEspera(isbns: readonly string[]): Libro[] {
  return LIBROS.filter((libro) => isbns.includes(libro.isbn));
}

// Dato calculado, no guardado: ejemplares del estante menos los que
// se llevaron desde el estante. Los entregados desde la lista de espera
// vienen de una devolución, así que no restan.
export function ejemplaresDisponibles(libro: Libro, prestamos: readonly Prestamo[]): number {
  const prestados = prestamos.filter(
    (p) => p.isbn === libro.isbn && p.origen === 'estante',
  ).length;
  return Math.max(0, libro.ejemplares - prestados);
}

export function colorDeTapa(isbn: string): string {
  const suma = isbn.split('').reduce((total, digito) => total + Number(digito), 0);
  return coloresTapa[suma % coloresTapa.length];
}
