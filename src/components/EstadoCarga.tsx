import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, tamanios } from '../constants/tema';

type Props = { mensaje: string };

export default function EstadoCarga({ mensaje }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colores.primario} />
      <Text style={estilos.mensaje}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingVertical: espacios.xxl,
    alignItems: 'center',
    gap: espacios.m,
  },
  mensaje: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.base,
    color: colores.textoSuave,
  },
});
