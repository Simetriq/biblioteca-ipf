import type { Libro } from '../types';

// Los dos primeros son los libros "a mano" para probar el escáner:
// reemplazá su ISBN por el de la contratapa de dos libros que tengas.
export const LIBROS: Libro[] = [
  { isbn: '9789507310010', titulo: 'Ficciones', autor: 'Jorge Luis Borges', anio: 1944, ejemplares: 2 },
  { isbn: '9789875666474', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, ejemplares: 0 },
  { isbn: '9789504912347', titulo: 'El Aleph', autor: 'Jorge Luis Borges', anio: 1949, ejemplares: 3 },
  { isbn: '9789877380101', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, ejemplares: 0 },
  { isbn: '9789500722353', titulo: 'Martín Fierro', autor: 'José Hernández', anio: 1872, ejemplares: 4 },
  { isbn: '9789509150065', titulo: 'Sobre héroes y tumbas', autor: 'Ernesto Sabato', anio: 1961, ejemplares: 1 },
  { isbn: '9789500441803', titulo: 'El túnel', autor: 'Ernesto Sabato', anio: 1948, ejemplares: 0 },
  { isbn: '9789871450763', titulo: 'Bestiario', autor: 'Julio Cortázar', anio: 1951, ejemplares: 2 },
  { isbn: '9789507314520', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, ejemplares: 1 },
  { isbn: '9788445000410', titulo: 'El señor de los anillos', autor: 'J. R. R. Tolkien', anio: 1954, ejemplares: 2 },
  { isbn: '9789875456129', titulo: 'Las venas abiertas de América Latina', autor: 'Eduardo Galeano', anio: 1971, ejemplares: 1 },
  { isbn: '9789500718394', titulo: 'Don Segundo Sombra', autor: 'Ricardo Güiraldes', anio: 1926, ejemplares: 3 },
  { isbn: '9789875661240', titulo: 'Cuentos de amor de locura y de muerte', autor: 'Horacio Quiroga', anio: 1917, ejemplares: 2 },
  { isbn: '9789505110018', titulo: 'Clean Code', autor: 'Robert C. Martin', anio: 2008, ejemplares: 0 },
  { isbn: '9789877251302', titulo: 'Fundamentos de bases de datos', autor: 'Abraham Silberschatz', anio: 2006, ejemplares: 1 },
  { isbn: '9789507318771', titulo: 'La invención de Morel', autor: 'Adolfo Bioy Casares', anio: 1940, ejemplares: 1 },
];

// Listas de espera al iniciar la app (solo libros con ejemplares: 0).
export const ESPERAS_INICIALES: Record<string, string[]> = {
  '9789875666474': ['Lucía Benítez', 'Matías Ojeda'],
  '9789877380101': ['Sofía Giménez'],
  '9789505110018': ['Tomás Duarte', 'Camila Ríos'],
};
