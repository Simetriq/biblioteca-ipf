import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacios, fuentes, letras, medidas, radios, tamanios } from '../constants/tema';

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
        pressed && (variante === 'primario' ? estilos.primarioPresionado : estilos.presionado),
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
    paddingHorizontal: espacios.xl,
    paddingVertical: espacios.m,
    borderRadius: radios.s,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: medidas.borde,
  },
  primario: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  primarioPresionado: {
    backgroundColor: colores.primarioOscuro,
    borderColor: colores.primarioOscuro,
  },
  secundario: {
    backgroundColor: colores.blanco,
    borderColor: colores.texto,
  },
  alerta: {
    backgroundColor: colores.blanco,
    borderColor: colores.alerta,
  },
  enlace: {
    borderColor: 'transparent',
    paddingHorizontal: espacios.s,
  },
  presionado: {
    backgroundColor: colores.superficie,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  etiqueta: {
    color: colores.texto,
    fontSize: tamanios.chico,
    fontFamily: fuentes.negrita,
    letterSpacing: letras.ancho,
    textTransform: 'uppercase',
  },
  etiquetaClara: {
    color: colores.blanco,
  },
  etiquetaAlerta: {
    color: colores.alerta,
  },
  etiquetaEnlace: {
    color: colores.primario,
    textDecorationLine: 'underline',
  },
});
