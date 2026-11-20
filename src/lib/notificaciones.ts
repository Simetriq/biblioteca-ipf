import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { CANAL_PRESTAMOS, SEGUNDOS_RECORDATORIO_DEMO } from '../constants/biblioteca';
import { colores } from '../constants/tema';

export function configurarPresentacion(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

// En Android 13+ el diálogo de permiso aparece recién cuando existe
// al menos un canal, por eso se crea antes de pedir.
export async function prepararCanal(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos',
    description: 'Recordatorios de devolución y libros listos para retirar.',
    importance: AndroidImportance.DEFAULT,
    lightColor: colores.primario,
  });
}

// Se consulta en el momento: el permiso puede cambiar desde Ajustes.
export async function notificacionesPermitidas(): Promise<boolean> {
  const respuesta = await Notifications.getPermissionsAsync();
  return respuesta.granted;
}

export async function programarRecordatorio(titulo: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Se acerca la devolución',
      body: `Recordá devolver «${titulo}» en la biblioteca.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO_DEMO,
      channelId: CANAL_PRESTAMOS,
    },
  });
}

export async function cancelarRecordatorio(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function avisarLibroListo(titulo: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tu libro está listo',
      body: `Llegó tu turno: retirá «${titulo}» en el mostrador.`,
    },
    trigger: Platform.OS === 'android' ? { channelId: CANAL_PRESTAMOS } : null,
  });
}
