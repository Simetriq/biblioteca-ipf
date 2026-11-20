import AsyncStorage from '@react-native-async-storage/async-storage';

import { CLAVE_ALMACENAMIENTO } from '../constants/biblioteca';
import type { EstadoGuardado } from '../types';

function esEstadoGuardado(valor: unknown): valor is EstadoGuardado {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const candidato = valor as Partial<EstadoGuardado>;
  return (
    Array.isArray(candidato.prestamos) &&
    Array.isArray(candidato.recientes) &&
    typeof candidato.esperas === 'object' &&
    candidato.esperas !== null
  );
}

// Si no hay nada guardado o el contenido está dañado, se empieza de cero.
export async function leerEstado(): Promise<EstadoGuardado | null> {
  try {
    const texto = await AsyncStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (texto === null) {
      return null;
    }
    const datos: unknown = JSON.parse(texto);
    return esEstadoGuardado(datos) ? datos : null;
  } catch {
    return null;
  }
}

export async function guardarEstado(estado: EstadoGuardado): Promise<void> {
  try {
    await AsyncStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
  } catch {
    // Sin espacio o sin acceso: la app sigue funcionando en memoria.
  }
}
