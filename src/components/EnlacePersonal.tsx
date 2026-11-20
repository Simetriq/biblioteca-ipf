import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacios, fuentes, iconos, letras, medidas, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

// Con sesión lleva al mostrador; sin sesión, al ingreso del personal.
export default function EnlacePersonal() {
  const { sesionIniciada } = useBiblioteca();
  return (
    <Link href={sesionIniciada ? '/mostrador' : '/login'} asChild>
      <Pressable accessibilityRole="button" style={estilos.enlace}>
        <Ionicons name="person-circle-outline" size={iconos.medio} color={colores.blanco} />
        <Text style={estilos.texto}>{sesionIniciada ? 'Mostrador' : 'Personal'}</Text>
      </Pressable>
    </Link>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs,
    minHeight: medidas.areaTactil,
    minWidth: medidas.areaTactil,
    paddingHorizontal: espacios.s,
  },
  texto: {
    fontSize: tamanios.mini,
    fontFamily: fuentes.negrita,
    color: colores.blanco,
    textTransform: 'uppercase',
    letterSpacing: letras.ancho,
  },
});
