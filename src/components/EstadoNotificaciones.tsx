import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, iconos, tamanios } from '../constants/tema';
import type { EstadoPermiso } from '../types';

type Props = { estado: EstadoPermiso };

const TEXTOS: Record<EstadoPermiso, string> = {
  cargando: 'Revisando las notificaciones…',
  concedido: 'Notificaciones activadas.',
  preguntable: 'Las notificaciones se piden al activar «Recordarme».',
  bloqueado: 'Notificaciones apagadas: tus avisos aparecen en esta pantalla.',
};

export default function EstadoNotificaciones({ estado }: Props) {
  const activas = estado === 'concedido';
  return (
    <View style={estilos.fila}>
      <Ionicons
        name={activas ? 'notifications-outline' : 'notifications-off-outline'}
        size={iconos.chico}
        color={activas ? colores.bosque : colores.tintaSuave}
      />
      <Text style={estilos.texto}>{TEXTOS[estado]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.s,
    paddingHorizontal: espacios.l,
    paddingBottom: espacios.m,
  },
  texto: {
    flex: 1,
    fontSize: tamanios.chico,
    color: colores.tintaSuave,
  },
});
