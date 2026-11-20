import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

type EstadoLibros = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
};

export function useLibros() {
  const [estado, setEstado] = useState<EstadoLibros>({
    libros: [],
    cargando: true,
    error: null,
  });
  // Cambiar este número es lo que vuelve a disparar el pedido.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerLibros()
      .then((libros) => {
        if (activo) {
          setEstado({ libros, cargando: false, error: null });
        }
      })
      .catch(() => {
        if (activo) {
          setEstado((anterior) => ({
            ...anterior,
            cargando: false,
            error: 'No pudimos conectarnos con la biblioteca. Revisá tu conexión e intentá de nuevo.',
          }));
        }
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, cargando: true, error: null }));
    setIntento((n) => n + 1);
  }, []);

  return { ...estado, reintentar };
}
