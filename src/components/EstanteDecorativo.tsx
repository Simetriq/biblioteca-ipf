import { StyleSheet, View } from 'react-native';

import { espacios, estilosTapa, medidas } from '../constants/tema';

const LOMOS = Array.from({ length: 22 }, (_, i) => i);
const ALTURAS = ['alto', 'medio', 'bajo'] as const;

// Fila de lomos de colores que hace de "foto" de estantería en el destacado.
export default function EstanteDecorativo() {
  return (
    <View style={estilos.estante} accessible={false} importantForAccessibility="no-hide-descendants">
      {LOMOS.map((i) => (
        <View
          key={i}
          style={[
            estilos.lomo,
            estilos[ALTURAS[(i * 7) % ALTURAS.length]],
            estilosTapa[(i * 3) % estilosTapa.length].fondo,
          ]}
        />
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  estante: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacios.xxs,
    paddingHorizontal: espacios.s,
  },
  lomo: {
    width: medidas.lomoEstante.ancho,
  },
  alto: {
    height: '92%',
  },
  medio: {
    height: '78%',
  },
  bajo: {
    height: '64%',
  },
});
