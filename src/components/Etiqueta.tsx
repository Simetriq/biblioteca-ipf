import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, letras, medidas, tamanios } from '../constants/tema';

type Props = { texto: string };

// Título de sección en mayúscula con una raya de color debajo.
export default function Etiqueta({ texto }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text accessibilityRole="header" style={estilos.etiqueta}>
        {texto}
      </Text>
      <View style={estilos.raya} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: espacios.m,
  },
  etiqueta: {
    fontSize: tamanios.chico,
    fontFamily: fuentes.extra,
    color: colores.texto,
    textTransform: 'uppercase',
    letterSpacing: letras.amplio,
  },
  raya: {
    marginTop: espacios.xs,
    width: medidas.marca.ancho,
    height: medidas.marca.alto,
    backgroundColor: colores.primario,
  },
});
