import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, letras, radios, tamanios } from '../constants/tema';

type Props = { cantidad: number };

// Etiqueta rectangular, como el precio de una tarjeta de producto.
export default function Disponibilidad({ cantidad }: Props) {
  const hay = cantidad > 0;
  const texto = hay ? `${cantidad} ${cantidad === 1 ? 'disponible' : 'disponibles'}` : 'Sin stock';
  return (
    <View style={[estilos.etiqueta, hay ? estilos.hay : estilos.noHay]}>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacios.s,
    paddingVertical: espacios.xs,
    borderRadius: radios.s,
  },
  hay: {
    backgroundColor: colores.primario,
  },
  noHay: {
    backgroundColor: colores.texto,
  },
  texto: {
    fontSize: tamanios.mini,
    fontFamily: fuentes.negrita,
    color: colores.blanco,
    textTransform: 'uppercase',
    letterSpacing: letras.ancho,
  },
});
