import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, letras, medidas, radios, sombras, tamanios } from '../constants/tema';
import type { Libro } from '../types';
import Disponibilidad from './Disponibilidad';
import Portada from './Portada';

type Props = {
  libro: Libro;
  disponibles: number;
  enEspera: number;
};

// Tarjeta de producto: tapa sobre fondo gris, cinta si hay lista de espera,
// etiqueta de disponibilidad abajo a la derecha y el título debajo.
export default function TarjetaLibro({ libro, disponibles, enEspera }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}. ${disponibles > 0 ? `${disponibles} disponibles` : 'Sin stock'}`}
      accessibilityHint="Abre la ficha del libro"
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
      <View style={estilos.vitrina}>
        <Portada libro={libro} tamanio="tarjeta" />
        <View style={estilos.precio}>
          <Disponibilidad cantidad={disponibles} />
        </View>
        {enEspera > 0 ? (
          <View style={estilos.cinta}>
            <Text style={estilos.cintaTexto}>{enEspera} en espera</Text>
          </View>
        ) : null}
      </View>
      <View style={estilos.datos}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={estilos.autor} numberOfLines={1}>
          {libro.autor} · {libro.anio}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colores.blanco,
    borderRadius: radios.s,
    ...sombras.tarjeta,
  },
  presionada: {
    opacity: 0.85,
  },
  vitrina: {
    margin: espacios.s,
    paddingTop: espacios.l,
    paddingBottom: espacios.xl,
    alignItems: 'center',
    backgroundColor: colores.superficie,
  },
  precio: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  cinta: {
    position: 'absolute',
    top: espacios.s,
    left: -espacios.xs,
    paddingHorizontal: espacios.s,
    paddingVertical: espacios.xxs,
    backgroundColor: colores.primario,
  },
  cintaTexto: {
    fontSize: tamanios.diminuto,
    fontFamily: fuentes.negrita,
    color: colores.blanco,
    textTransform: 'uppercase',
    letterSpacing: letras.ancho,
  },
  datos: {
    paddingHorizontal: espacios.m,
    paddingBottom: espacios.m,
    gap: espacios.xs,
    minHeight: medidas.areaTactil,
  },
  titulo: {
    fontSize: tamanios.chico,
    fontFamily: fuentes.extra,
    color: colores.texto,
    textTransform: 'uppercase',
    lineHeight: tamanios.chico * 1.3,
  },
  autor: {
    fontSize: tamanios.mini,
    fontFamily: fuentes.regular,
    color: colores.textoSuave,
  },
});
