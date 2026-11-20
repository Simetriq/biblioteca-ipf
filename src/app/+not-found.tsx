import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, tamanios } from '@/constants/tema';

export default function NoEncontrada() {
  const ruta = usePathname();
  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.numero}>404</Text>
      <Text style={estilos.titulo}>Esta página no está en el catálogo</Text>
      <Text style={estilos.ruta}>{ruta}</Text>
      <Text style={estilos.texto}>Puede que el enlace esté mal escrito o sea de una versión vieja.</Text>
      <Link href="/" style={estilos.enlace}>
        Volver al catálogo
      </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: espacios.xl,
    justifyContent: 'center',
    backgroundColor: colores.fondo,
  },
  numero: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.portada * 2,
    color: colores.primario,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.grande,
    color: colores.texto,
  },
  ruta: {
    marginTop: espacios.m,
    alignSelf: 'flex-start',
    paddingHorizontal: espacios.s,
    paddingVertical: espacios.xs,
    backgroundColor: colores.superficie,
    fontFamily: fuentes.mono,
    fontSize: tamanios.chico,
    color: colores.texto,
  },
  texto: {
    marginTop: espacios.m,
    fontSize: tamanios.base,
    color: colores.textoSuave,
  },
  enlace: {
    marginTop: espacios.xl,
    minHeight: medidas.areaTactil,
    paddingVertical: espacios.m,
    fontFamily: fuentes.negrita,
    fontSize: tamanios.medio,
    color: colores.primario,
    textDecorationLine: 'underline',
  },
});
