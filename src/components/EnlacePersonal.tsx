import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacios, medidas, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

// Con sesión lleva al mostrador; sin sesión, al ingreso del personal.
export default function EnlacePersonal() {
  const { sesionIniciada } = useBiblioteca();
  return (
    <Link href={sesionIniciada ? '/mostrador' : '/login'} asChild>
      <Pressable accessibilityRole="button" style={estilos.enlace}>
        <Text style={estilos.texto}>{sesionIniciada ? 'Mostrador' : 'Personal'}</Text>
      </Pressable>
    </Link>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    minHeight: medidas.areaTactil,
    minWidth: medidas.areaTactil,
    justifyContent: 'center',
    paddingHorizontal: espacios.s,
  },
  texto: {
    fontSize: tamanios.chico,
    fontWeight: '700',
    color: colores.bosque,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
