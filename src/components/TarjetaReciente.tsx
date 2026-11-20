import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacios, medidas, tamanios } from '../constants/tema';
import type { Libro } from '../types';
import Portada from './Portada';

type Props = { libro: Libro };

export default function TarjetaReciente({ libro }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Visto hace poco: ${libro.titulo}`}
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
      <Portada libro={libro} tamanio="media" />
      <Text style={estilos.titulo} numberOfLines={1}>
        {libro.titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: medidas.portadaMedia.ancho,
    gap: espacios.xs,
  },
  presionada: {
    opacity: 0.7,
  },
  titulo: {
    fontSize: tamanios.mini,
    color: colores.textoSuave,
  },
});
