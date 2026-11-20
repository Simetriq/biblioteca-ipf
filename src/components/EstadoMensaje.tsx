import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, tamanios } from '../constants/tema';
import Boton from './Boton';

type Props = {
  titulo: string;
  detalle?: string;
  accion?: { titulo: string; onPress: () => void };
  tono?: 'neutro' | 'error';
};

// Sirve para los estados vacío y error: un título, una explicación
// y, si corresponde, la acción que saca a la persona de ahí.
export default function EstadoMensaje({ titulo, detalle, accion, tono = 'neutro' }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      <View style={[estilos.marca, tono === 'error' && estilos.marcaError]} />
      <Text style={estilos.titulo}>{titulo}</Text>
      {detalle ? <Text style={estilos.detalle}>{detalle}</Text> : null}
      {accion ? (
        <View style={estilos.accion}>
          <Boton titulo={accion.titulo} onPress={accion.onPress} variante="secundario" />
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingVertical: espacios.xxl,
    paddingHorizontal: espacios.xl,
    alignItems: 'center',
  },
  marca: {
    width: medidas.marca.ancho,
    height: medidas.marca.alto,
    backgroundColor: colores.primario,
    marginBottom: espacios.l,
  },
  marcaError: {
    backgroundColor: colores.alerta,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.medio,
    color: colores.texto,
    textAlign: 'center',
  },
  detalle: {
    marginTop: espacios.s,
    fontSize: tamanios.base,
    lineHeight: tamanios.base * 1.45,
    color: colores.textoSuave,
    textAlign: 'center',
  },
  accion: {
    marginTop: espacios.l,
  },
});
