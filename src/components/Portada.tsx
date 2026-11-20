import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, radios, tamanios } from '../constants/tema';
import { colorDeTapa } from '../lib/catalogo';
import type { Libro } from '../types';

type Tamanio = 'chica' | 'media' | 'grande';

type Props = {
  libro: Pick<Libro, 'isbn' | 'titulo' | 'autor'>;
  tamanio?: Tamanio;
};

// Tapa dibujada: no hay imágenes de portada, así que cada libro
// tiene su color, un lomo y el título compuesto como en una edición de bolsillo.
export default function Portada({ libro, tamanio = 'chica' }: Props) {
  const fondo = { backgroundColor: colorDeTapa(libro.isbn) };
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[estilos.tapa, estilos[tamanio], fondo]}>
      <View style={estilos.lomo} />
      {tamanio === 'chica' ? (
        <Text style={estilos.inicial}>{libro.titulo.charAt(0)}</Text>
      ) : (
        <View style={estilos.contenido}>
          <View style={estilos.filete} />
          <Text
            style={[estilos.titulo, tamanio === 'grande' && estilos.tituloGrande]}
            numberOfLines={4}>
            {libro.titulo}
          </Text>
          <Text style={estilos.autor} numberOfLines={2}>
            {libro.autor}
          </Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tapa: {
    borderRadius: radios.s,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  chica: {
    width: medidas.portadaChica.ancho,
    height: medidas.portadaChica.alto,
    alignItems: 'center',
  },
  media: {
    width: medidas.portadaMedia.ancho,
    height: medidas.portadaMedia.alto,
  },
  grande: {
    width: medidas.portadaGrande.ancho,
    height: medidas.portadaGrande.alto,
  },
  lomo: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: medidas.lomo,
    backgroundColor: colores.tinta,
    opacity: 0.25,
  },
  inicial: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.portada,
    color: colores.hoja,
    opacity: 0.9,
  },
  contenido: {
    flex: 1,
    paddingLeft: espacios.m + medidas.lomo,
    paddingRight: espacios.s,
    paddingVertical: espacios.m,
    justifyContent: 'space-between',
  },
  filete: {
    height: medidas.borde,
    width: '40%',
    backgroundColor: colores.hoja,
    opacity: 0.6,
  },
  titulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.chico,
    lineHeight: tamanios.chico * 1.25,
    color: colores.hoja,
  },
  tituloGrande: {
    fontSize: tamanios.grande,
    lineHeight: tamanios.grande * 1.2,
  },
  autor: {
    fontSize: tamanios.mini,
    color: colores.hoja,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
