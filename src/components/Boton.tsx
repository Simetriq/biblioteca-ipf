import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacios, fuentes, medidas, radios, tamanios } from '../constants/tema';

type Variante = 'primario' | 'secundario' | 'alerta' | 'enlace';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  pista?: string;
};

export default function Boton({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  pista,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={pista}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && estilos.presionado,
        deshabilitado && estilos.deshabilitado,
      ]}>
      <Text
        style={[
          estilos.etiqueta,
          variante === 'primario' && estilos.etiquetaClara,
          variante === 'alerta' && estilos.etiquetaAlerta,
          variante === 'enlace' && estilos.etiquetaEnlace,
        ]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: medidas.areaTactil,
    minWidth: medidas.areaTactil,
    paddingHorizontal: espacios.l,
    paddingVertical: espacios.m,
    borderRadius: radios.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: medidas.borde,
  },
  primario: {
    backgroundColor: colores.bosque,
    borderColor: colores.bosque,
  },
  secundario: {
    backgroundColor: colores.hoja,
    borderColor: colores.tinta,
  },
  alerta: {
    backgroundColor: colores.hoja,
    borderColor: colores.terracota,
  },
  enlace: {
    borderColor: colores.papel,
    paddingHorizontal: espacios.s,
  },
  presionado: {
    opacity: 0.7,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  etiqueta: {
    color: colores.tinta,
    fontSize: tamanios.base,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  etiquetaClara: {
    color: colores.hoja,
  },
  etiquetaAlerta: {
    color: colores.terracota,
  },
  etiquetaEnlace: {
    color: colores.bosque,
    fontFamily: fuentes.serif,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});
