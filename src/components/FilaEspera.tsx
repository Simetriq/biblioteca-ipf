import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, tamanios } from '../constants/tema';

type Props = {
  isbn: string;
  titulo: string;
  posicion: number;
};

export default function FilaEspera({ isbn, titulo, posicion }: Props) {
  const descripcion = posicion === 1 ? 'Sos la próxima persona' : `Hay ${posicion - 1} antes que vos`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. Posición ${posicion} en la lista de espera`}
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn } })}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}>
      <View style={estilos.numero}>
        <Text style={estilos.numeroTexto}>{posicion}º</Text>
      </View>
      <View style={estilos.datos}>
        <Text style={estilos.titulo} numberOfLines={1}>
          {titulo}
        </Text>
        <Text style={estilos.detalle}>{descripcion}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.l,
    marginHorizontal: espacios.l,
    paddingVertical: espacios.m,
    borderBottomWidth: medidas.borde,
    borderBottomColor: colores.borde,
    minHeight: medidas.areaTactil,
  },
  presionada: {
    opacity: 0.7,
  },
  numero: {
    width: medidas.areaTactil,
    alignItems: 'center',
  },
  numeroTexto: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.grande,
    color: colores.primario,
  },
  datos: {
    flex: 1,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.medio,
    color: colores.texto,
  },
  detalle: {
    fontSize: tamanios.chico,
    color: colores.textoSuave,
  },
});
