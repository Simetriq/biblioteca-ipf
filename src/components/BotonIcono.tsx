import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colores, iconos, medidas, radios } from '../constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  etiqueta: string;
  onPress: () => void;
};

export default function BotonIcono({ icono, etiqueta, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons name={icono} size={iconos.grande} color={colores.textoSuave} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: medidas.areaTactil,
    height: medidas.areaTactil,
    borderRadius: radios.pastilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    backgroundColor: colores.superficie,
  },
});
