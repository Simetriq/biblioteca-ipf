import { StyleSheet, Text } from 'react-native';

import { colores, espacios, tamanios } from '../constants/tema';

type Props = { texto: string };

// Rótulo chico en versalitas, como los de una ficha de biblioteca.
export default function Etiqueta({ texto }: Props) {
  return (
    <Text accessibilityRole="header" style={estilos.etiqueta}>
      {texto}
    </Text>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    fontSize: tamanios.mini,
    fontWeight: '700',
    color: colores.tintaSuave,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: espacios.s,
  },
});
