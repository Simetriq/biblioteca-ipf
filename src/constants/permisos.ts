import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import type { Recurso } from '../types';

type Explicacion = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  beneficio: string;
  bloqueado: string;
};

// Pantalla previa: el beneficio en una frase, antes del diálogo del sistema.
export const EXPLICACIONES_PERMISO: Record<Recurso, Explicacion> = {
  camara: {
    icono: 'barcode-outline',
    titulo: 'Cámara',
    beneficio: 'Apuntás al código de barras de la contratapa y el libro se abre solo, sin tipear 13 números.',
    bloqueado: 'La cámara está desactivada para esta app. Podés activarla en Ajustes o escribir el ISBN a mano.',
  },
  notificaciones: {
    icono: 'notifications-outline',
    titulo: 'Notificaciones',
    beneficio: 'Te avisamos antes de la fecha de devolución y cuando llega tu turno en la lista de espera.',
    bloqueado: 'Las notificaciones están desactivadas. Podés activarlas en Ajustes; mientras tanto, los avisos aparecen en «Mis reservas».',
  },
};

export function esRecurso(valor: string): valor is Recurso {
  return valor === 'camara' || valor === 'notificaciones';
}
