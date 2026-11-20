import { StyleSheet, Text, View } from 'react-native';

import {
  colores,
  espacios,
  estilosTapa,
  fuentes,
  letras,
  medidas,
  radios,
  sombras,
  tamanios,
} from '../constants/tema';
import { indiceTapa } from '../lib/catalogo';
import type { Libro } from '../types';

type Tamanio = 'chica' | 'media' | 'tarjeta' | 'grande';

type Props = {
  libro: Pick<Libro, 'isbn' | 'titulo' | 'autor'>;
  tamanio?: Tamanio;
};

// Tapa dibujada: no hay imágenes de portada, así que cada libro tiene
// su color y el título compuesto en mayúscula, como una edición moderna.
export default function Portada({ libro, tamanio = 'chica' }: Props) {
  const tapa = estilosTapa[indiceTapa(libro.isbn)];
  const fondo = tapa.fondo;
  const tinta = tapa.texto;
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[estilos.tapa, estilos[tamanio], fondo]}>
      <View style={estilos.lomo} />
      {tamanio === 'chica' ? (
        <Text style={[estilos.inicial, tinta]}>{libro.titulo.charAt(0)}</Text>
      ) : (
        <View style={estilos.contenido}>
          <Text style={[estilos.autor, tinta]} numberOfLines={2}>
            {libro.autor}
          </Text>
          <Text
            style={[estilos.titulo, tamanio === 'grande' && estilos.tituloGrande, tinta]}
            numberOfLines={5}
            adjustsFontSizeToFit
            minimumFontScale={0.7}>
            {libro.titulo}
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
    ...sombras.tarjeta,
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
  tarjeta: {
    width: medidas.portadaTarjeta.ancho,
    height: medidas.portadaTarjeta.alto,
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
    backgroundColor: colores.lomoSombra,
  },
  inicial: {
    fontFamily: fuentes.extra,
    fontSize: tamanios.portada,
  },
  contenido: {
    flex: 1,
    paddingLeft: espacios.s + medidas.lomo,
    paddingRight: espacios.s,
    paddingVertical: espacios.m,
    justifyContent: 'center',
    alignItems: 'center',
    gap: espacios.s,
  },
  autor: {
    fontFamily: fuentes.semi,
    fontSize: tamanios.diminuto,
    textTransform: 'uppercase',
    letterSpacing: letras.ancho,
    textAlign: 'center',
  },
  titulo: {
    fontFamily: fuentes.extra,
    fontSize: tamanios.mini,
    lineHeight: tamanios.mini * 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tituloGrande: {
    fontSize: tamanios.grande,
    lineHeight: tamanios.grande * 1.15,
  },
});
