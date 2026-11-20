import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  CANTIDAD_RECIENTES,
  CREDENCIALES_PERSONAL,
  DIAS_PRESTAMO,
  YO,
} from '../constants/biblioteca';
import { ESPERAS_INICIALES } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import { guardarEstado, leerEstado } from '../lib/almacenamiento';
import { buscarLibroPorIsbn, ejemplaresDisponibles } from '../lib/catalogo';
import { sumarDias } from '../lib/fechas';
import {
  avisarLibroListo,
  cancelarRecordatorio,
  notificacionesPermitidas,
  programarRecordatorio,
} from '../lib/notificaciones';
import type { Aviso, Libro, Prestamo, ResultadoReserva } from '../types';

type Esperas = Record<string, Cola<string>>;

export type ValorBiblioteca = {
  listo: boolean;
  prestamos: Prestamo[];
  esperas: Esperas;
  recientes: Libro[];
  avisos: Aviso[];
  sesionIniciada: boolean;
  registrarVisto: (libro: Libro) => void;
  reservar: (libro: Libro) => ResultadoReserva;
  devolver: (isbn: string) => Promise<void>;
  activarRecordatorio: (isbn: string) => Promise<void>;
  desactivarRecordatorio: (isbn: string) => Promise<void>;
  entregarAlSiguiente: (isbn: string) => Promise<string | null>;
  agregarAviso: (texto: string) => void;
  descartarAviso: (id: string) => void;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
};

export const BibliotecaContext = createContext<ValorBiblioteca | null>(null);

function colasDesde(listas: Record<string, string[]>): Esperas {
  const resultado: Esperas = {};
  Object.entries(listas).forEach(([isbn, personas]) => {
    resultado[isbn] = new Cola(personas);
  });
  return resultado;
}

function listasDesde(esperas: Esperas): Record<string, string[]> {
  const resultado: Record<string, string[]> = {};
  Object.entries(esperas).forEach(([isbn, cola]) => {
    resultado[isbn] = cola.aArray();
  });
  return resultado;
}

// Las estructuras son mutables, pero React compara por referencia:
// cada cambio crea una Pila/Cola nueva a partir de la anterior.
function recientesUnicos(pila: Pila<Libro>): Libro[] {
  const vistos = new Set<string>();
  const resultado: Libro[] = [];
  for (const libro of pila.aArray().reverse()) {
    if (!vistos.has(libro.isbn)) {
      vistos.add(libro.isbn);
      resultado.push(libro);
    }
    if (resultado.length === CANTIDAD_RECIENTES) {
      break;
    }
  }
  return resultado;
}

let contadorAvisos = 0;
function nuevoIdAviso(): string {
  contadorAvisos += 1;
  return `aviso-${Date.now()}-${contadorAvisos}`;
}

type Props = { children: ReactNode };

export function BibliotecaProvider({ children }: Props) {
  const [listo, setListo] = useState(false);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [esperas, setEsperas] = useState<Esperas>(() => colasDesde(ESPERAS_INICIALES));
  const [pilaRecientes, setPilaRecientes] = useState(() => new Pila<Libro>());
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [sesionIniciada, setSesionIniciada] = useState(false);

  // Copia actualizada de los préstamos para leerla después de un await.
  const prestamosRef = useRef(prestamos);
  useEffect(() => {
    prestamosRef.current = prestamos;
  }, [prestamos]);

  useEffect(() => {
    let activo = true;
    leerEstado().then((guardado) => {
      if (!activo) {
        return;
      }
      if (guardado) {
        setPrestamos(guardado.prestamos);
        setEsperas(colasDesde(guardado.esperas));
        setPilaRecientes(new Pila(guardado.recientes));
      }
      setListo(true);
    });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!listo) {
      return;
    }
    const temporizador = setTimeout(() => {
      guardarEstado({
        prestamos,
        recientes: pilaRecientes.aArray(),
        esperas: listasDesde(esperas),
      });
    }, 300);
    return () => clearTimeout(temporizador);
  }, [listo, prestamos, pilaRecientes, esperas]);

  const agregarAviso = useCallback((texto: string) => {
    setAvisos((anteriores) => [{ id: nuevoIdAviso(), texto }, ...anteriores]);
  }, []);

  const descartarAviso = useCallback((id: string) => {
    setAvisos((anteriores) => anteriores.filter((aviso) => aviso.id !== id));
  }, []);

  const registrarVisto = useCallback((libro: Libro) => {
    setPilaRecientes((anterior) => {
      if (anterior.tope()?.isbn === libro.isbn) {
        return anterior;
      }
      const nueva = new Pila(anterior.aArray());
      nueva.apilar(libro);
      return nueva;
    });
  }, []);

  const reservar = useCallback(
    (libro: Libro): ResultadoReserva => {
      const yaPrestado = prestamos.some((p) => p.isbn === libro.isbn);
      const colaActual = esperas[libro.isbn];
      const yaEnEspera = colaActual?.aArray().includes(YO) ?? false;
      if (yaPrestado || yaEnEspera) {
        return {
          tipo: 'rechazada',
          motivo: yaPrestado
            ? 'Ya tenés este libro en préstamo.'
            : 'Ya estás en la lista de espera de este libro.',
        };
      }

      if (ejemplaresDisponibles(libro, prestamos) > 0) {
        const vence = sumarDias(new Date(), DIAS_PRESTAMO).toISOString();
        setPrestamos((anteriores) => [
          ...anteriores,
          {
            isbn: libro.isbn,
            titulo: libro.titulo,
            vence,
            origen: 'estante',
            recordar: false,
            notificacionId: null,
          },
        ]);
        return { tipo: 'prestamo', vence };
      }

      const nueva = new Cola(colaActual?.aArray() ?? []);
      nueva.encolar(YO);
      setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: nueva }));
      return { tipo: 'espera', posicion: nueva.tamanio };
    },
    [prestamos, esperas],
  );

  const devolver = useCallback(async (isbn: string) => {
    const prestamo = prestamosRef.current.find((p) => p.isbn === isbn);
    setPrestamos((anteriores) => anteriores.filter((p) => p.isbn !== isbn));
    if (prestamo?.notificacionId) {
      await cancelarRecordatorio(prestamo.notificacionId);
    }
  }, []);

  const activarRecordatorio = useCallback(async (isbn: string) => {
    const prestamo = prestamosRef.current.find((p) => p.isbn === isbn);
    if (!prestamo || prestamo.notificacionId) {
      return;
    }
    const id = await programarRecordatorio(prestamo.titulo);
    // Si mientras tanto se devolvió el libro, la notificación ya no corresponde.
    if (!prestamosRef.current.some((p) => p.isbn === isbn)) {
      await cancelarRecordatorio(id);
      return;
    }
    setPrestamos((anteriores) =>
      anteriores.map((p) =>
        p.isbn === isbn ? { ...p, recordar: true, notificacionId: id } : p,
      ),
    );
  }, []);

  const desactivarRecordatorio = useCallback(async (isbn: string) => {
    const prestamo = prestamosRef.current.find((p) => p.isbn === isbn);
    setPrestamos((anteriores) =>
      anteriores.map((p) =>
        p.isbn === isbn ? { ...p, recordar: false, notificacionId: null } : p,
      ),
    );
    if (prestamo?.notificacionId) {
      await cancelarRecordatorio(prestamo.notificacionId);
    }
  }, []);

  const entregarAlSiguiente = useCallback(
    async (isbn: string): Promise<string | null> => {
      const colaActual = esperas[isbn];
      if (!colaActual || colaActual.estaVacia()) {
        return null;
      }
      const nueva = new Cola(colaActual.aArray());
      const persona = nueva.desencolar() ?? null;
      setEsperas((anteriores) => ({ ...anteriores, [isbn]: nueva }));

      const libro = buscarLibroPorIsbn(isbn);
      if (persona === YO && libro) {
        setPrestamos((anteriores) => [
          ...anteriores,
          {
            isbn,
            titulo: libro.titulo,
            vence: sumarDias(new Date(), DIAS_PRESTAMO).toISOString(),
            origen: 'espera',
            recordar: false,
            notificacionId: null,
          },
        ]);
        if (await notificacionesPermitidas()) {
          await avisarLibroListo(libro.titulo);
        } else {
          agregarAviso(`Llegó tu turno: «${libro.titulo}» ya está a tu nombre. Retiralo en el mostrador.`);
        }
      }
      return persona;
    },
    [esperas, agregarAviso],
  );

  const iniciarSesion = useCallback((usuario: string, clave: string) => {
    const correcto =
      usuario.trim().toLowerCase() === CREDENCIALES_PERSONAL.usuario &&
      clave === CREDENCIALES_PERSONAL.clave;
    if (correcto) {
      setSesionIniciada(true);
    }
    return correcto;
  }, []);

  const cerrarSesion = useCallback(() => {
    setSesionIniciada(false);
  }, []);

  const recientes = useMemo(() => recientesUnicos(pilaRecientes), [pilaRecientes]);

  const valor = useMemo<ValorBiblioteca>(
    () => ({
      listo,
      prestamos,
      esperas,
      recientes,
      avisos,
      sesionIniciada,
      registrarVisto,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      agregarAviso,
      descartarAviso,
      iniciarSesion,
      cerrarSesion,
    }),
    [
      listo,
      prestamos,
      esperas,
      recientes,
      avisos,
      sesionIniciada,
      registrarVisto,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      agregarAviso,
      descartarAviso,
      iniciarSesion,
      cerrarSesion,
    ],
  );

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}
