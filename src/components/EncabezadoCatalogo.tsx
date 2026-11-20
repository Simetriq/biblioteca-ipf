import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacios, fuentes, iconos, medidas, radios, tamanios } from '../constants/tema';
import type { Libro } from '../types';
import Etiqueta from './Etiqueta';
import TarjetaReciente from './TarjetaReciente';

type Props = { recientes: Libro[] };

export default function EncabezadoCatalogo({ recientes }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.saludo}>¿Qué vas a leer{'\n'}esta semana?</Text>

      <View style={estilos.acciones}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Buscar por título o autor"
          onPress={() => router.push('/buscar')}
          style={({ pressed }) => [estilos.buscar, pressed && estilos.presionado]}>
          <Ionicons name="search" size={iconos.medio} color={colores.tintaSuave} />
          <Text style={estilos.buscarTexto}>Buscar título o autor</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escanear código de barras"
          onPress={() => router.push('/escanear')}
          style={({ pressed }) => [estilos.escanear, pressed && estilos.presionado]}>
          <Ionicons name="barcode-outline" size={iconos.enorme} color={colores.hoja} />
          <Text style={estilos.escanearTexto}>Escanear</Text>
        </Pressable>
      </View>

      {recientes.length > 0 ? (
        <View style={estilos.recientes}>
          <Etiqueta texto="Vistos recientemente" />
          <View style={estilos.filaRecientes}>
            {recientes.map((libro) => (
              <TarjetaReciente key={libro.isbn} libro={libro} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={estilos.separador}>
        <Etiqueta texto="Todo el catálogo" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingTop: espacios.l,
  },
  saludo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.titulo,
    lineHeight: tamanios.titulo * 1.15,
    color: colores.tinta,
    paddingHorizontal: espacios.l,
    marginBottom: espacios.l,
  },
  acciones: {
    flexDirection: 'row',
    gap: espacios.s,
    paddingHorizontal: espacios.l,
  },
  buscar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.s,
    minHeight: medidas.areaTactil,
    paddingHorizontal: espacios.m,
    borderRadius: radios.m,
    borderWidth: medidas.borde,
    borderColor: colores.linea,
    backgroundColor: colores.hoja,
  },
  buscarTexto: {
    fontSize: tamanios.base,
    color: colores.tintaTenue,
  },
  escanear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.xs,
    minHeight: medidas.areaTactil,
    paddingHorizontal: espacios.m,
    borderRadius: radios.m,
    backgroundColor: colores.bosque,
  },
  escanearTexto: {
    color: colores.hoja,
    fontWeight: '600',
    fontSize: tamanios.chico,
  },
  presionado: {
    opacity: 0.75,
  },
  recientes: {
    marginTop: espacios.xl,
    paddingHorizontal: espacios.l,
  },
  filaRecientes: {
    flexDirection: 'row',
    gap: espacios.m,
  },
  separador: {
    marginTop: espacios.xl,
    paddingHorizontal: espacios.l,
    paddingBottom: espacios.xs,
    borderBottomWidth: medidas.borde,
    borderBottomColor: colores.tinta,
  },
});
