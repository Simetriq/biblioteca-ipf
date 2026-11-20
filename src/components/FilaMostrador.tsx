import { StyleSheet, Text, View } from 'react-native';

import { YO } from '../constants/biblioteca';
import { colores, espacios, fuentes, medidas, tamanios } from '../constants/tema';
import type { Libro } from '../types';
import Boton from './Boton';
import Portada from './Portada';

type Props = {
  libro: Libro;
  alFrente: string | undefined;
  cantidad: number;
  ocupado: boolean;
  onEntregar: (libro: Libro) => void;
};

export default function FilaMostrador({ libro, alFrente, cantidad, ocupado, onEntregar }: Props) {
  const vacia = cantidad === 0;
  return (
    <View style={estilos.fila}>
      <Portada libro={libro} />
      <View style={estilos.datos}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={estilos.detalle}>
          {vacia
            ? 'Nadie en espera'
            : `Al frente: ${alFrente === YO ? 'la persona de este teléfono' : alFrente} · ${cantidad} ${cantidad === 1 ? 'espera' : 'esperan'}`}
        </Text>
        <View style={estilos.accion}>
          <Boton
            titulo="Entregar al siguiente"
            variante="secundario"
            deshabilitado={vacia || ocupado}
            onPress={() => onEntregar(libro)}
          />
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espacios.l,
    paddingVertical: espacios.l,
    paddingHorizontal: espacios.l,
    borderBottomWidth: medidas.borde,
    borderBottomColor: colores.borde,
  },
  datos: {
    flex: 1,
    gap: espacios.xs,
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
  accion: {
    marginTop: espacios.s,
    alignSelf: 'flex-start',
  },
});
