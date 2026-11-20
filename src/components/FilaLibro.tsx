import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, tamanios } from '../constants/tema';
import type { Libro } from '../types';
import Disponibilidad from './Disponibilidad';
import Portada from './Portada';

type Props = {
  libro: Libro;
  disponibles: number;
};

export default function FilaLibro({ libro, disponibles }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
      accessibilityHint="Abre la ficha del libro"
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}>
      <Portada libro={libro} />
      <View style={estilos.datos}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={estilos.autor} numberOfLines={1}>
          {libro.autor} · {libro.anio}
        </Text>
        <Disponibilidad cantidad={disponibles} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espacios.l,
    paddingVertical: espacios.m,
    paddingHorizontal: espacios.l,
    borderBottomWidth: medidas.borde,
    borderBottomColor: colores.linea,
    minHeight: medidas.areaTactil,
  },
  presionada: {
    backgroundColor: colores.papelHondo,
  },
  datos: {
    flex: 1,
    justifyContent: 'center',
    gap: espacios.xs,
  },
  titulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.medio,
    color: colores.tinta,
  },
  autor: {
    fontSize: tamanios.chico,
    color: colores.tintaSuave,
    marginBottom: espacios.xs,
  },
});
