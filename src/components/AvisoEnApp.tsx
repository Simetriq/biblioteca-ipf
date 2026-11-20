import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, medidas, radios, tamanios } from '../constants/tema';
import type { Aviso } from '../types';
import BotonIcono from './BotonIcono';

type Props = {
  aviso: Aviso;
  onDescartar: (id: string) => void;
};

// Reemplaza a la notificación cuando el permiso no está concedido.
export default function AvisoEnApp({ aviso, onDescartar }: Props) {
  return (
    <View style={estilos.aviso} accessibilityLiveRegion="polite">
      <View style={estilos.borde} />
      <Text style={estilos.texto}>{aviso.texto}</Text>
      <BotonIcono icono="close" etiqueta="Descartar aviso" onPress={() => onDescartar(aviso.id)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: espacios.l,
    marginBottom: espacios.s,
    backgroundColor: colores.ocreClaro,
    borderRadius: radios.m,
    overflow: 'hidden',
  },
  borde: {
    alignSelf: 'stretch',
    width: medidas.lomo,
    backgroundColor: colores.ocre,
  },
  texto: {
    flex: 1,
    paddingVertical: espacios.m,
    paddingHorizontal: espacios.m,
    fontSize: tamanios.chico,
    lineHeight: tamanios.chico * 1.4,
    color: colores.tinta,
  },
});
