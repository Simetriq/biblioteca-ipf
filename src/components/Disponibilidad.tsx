import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, radios, tamanios } from '../constants/tema';

type Props = { cantidad: number };

export default function Disponibilidad({ cantidad }: Props) {
  const hay = cantidad > 0;
  const texto = hay
    ? `${cantidad} ${cantidad === 1 ? 'disponible' : 'disponibles'}`
    : 'Sin ejemplares';
  return (
    <View style={[estilos.sello, hay ? estilos.hay : estilos.noHay]}>
      <Text style={[estilos.texto, hay ? estilos.textoHay : estilos.textoNoHay]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  sello: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacios.s,
    paddingVertical: espacios.xxs,
    borderRadius: radios.pastilla,
  },
  hay: {
    backgroundColor: colores.bosqueClaro,
  },
  noHay: {
    backgroundColor: colores.terracotaClara,
  },
  texto: {
    fontSize: tamanios.mini,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textoHay: {
    color: colores.bosque,
  },
  textoNoHay: {
    color: colores.terracota,
  },
});
