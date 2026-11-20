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

// El color sale de la posición del libro en el catálogo, así dos libros
// seguidos nunca comparten tapa. Si el ISBN no está, se usa un hash.
export function indiceTapa(isbn: string): number {
  const posicion = LIBROS.findIndex((libro) => libro.isbn === isbn);
  if (posicion >= 0) {
    return posicion % coloresTapa.length;
  }
  const hash = isbn.split('').reduce((total, caracter) => total * 31 + caracter.charCodeAt(0), 7);
  return Math.abs(hash) % coloresTapa.length;
}
