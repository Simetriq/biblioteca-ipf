import { useEffect, useState } from 'react';

import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

type Resultado = { consulta: string; libros: Libro[] } | { consulta: string; error: string };

// Busca lo que dice la URL. Solo guarda la respuesta del pedido vigente:
// la limpieza marca como vencido el pedido anterior cuando cambia q.
export function useBusqueda(q: string) {
  const consulta = q.trim();
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    if (consulta === '') {
      return;
    }
    let vigente = true;
    buscarLibros(consulta)
      .then((libros) => {
        if (vigente) {
          setResultado({ consulta, libros });
        }
      })
      .catch(() => {
        if (vigente) {
          setResultado({ consulta, error: 'No pudimos buscar en este momento. Probá de nuevo.' });
        }
      });
    return () => {
      vigente = false;
    };
  }, [consulta]);

  const actual = resultado?.consulta === consulta ? resultado : null;
  return {
    consulta,
    cargando: consulta !== '' && actual === null,
    libros: actual && 'libros' in actual ? actual.libros : [],
    error: actual && 'error' in actual ? actual.error : null,
  };
}
