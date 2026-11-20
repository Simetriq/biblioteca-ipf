export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

// "estante": se llevó un ejemplar disponible.
// "espera": se lo entregaron desde el mostrador al llegar su turno.
export type OrigenPrestamo = 'estante' | 'espera';

export type Prestamo = {
  isbn: string;
  titulo: string;
  vence: string; // fecha ISO
  origen: OrigenPrestamo;
  recordar: boolean;
  notificacionId: string | null;
};

export type Aviso = {
  id: string;
  texto: string;
};

export type ResultadoReserva =
  | { tipo: 'prestamo'; vence: string }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'rechazada'; motivo: string };

export type Recurso = 'camara' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type EstadoGuardado = {
  prestamos: Prestamo[];
  recientes: Libro[];
  esperas: Record<string, string[]>;
};
