import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  colores,
  espacios,
  fuentes,
  iconos,
  letras,
  medidas,
  radios,
  tamanios,
} from '../constants/tema';
import type { Libro } from '../types';
import Etiqueta from './Etiqueta';
import EstanteDecorativo from './EstanteDecorativo';
import TarjetaReciente from './TarjetaReciente';

type Props = { recientes: Libro[] };

export default function EncabezadoCatalogo({ recientes }: Props) {
  return (
    <View>
      <View style={estilos.hero}>
        <EstanteDecorativo />
        <View style={estilos.velo} />
        <View style={estilos.heroContenido}>
          <Text style={estilos.heroTitulo}>Te ayudamos a encontrar tu próximo libro</Text>
          <Text style={estilos.heroTexto}>Reservalo desde el celular y retiralo en el mostrador.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Escanear código de barras"
            onPress={() => router.push('/escanear')}
            style={({ pressed }) => [estilos.heroBoton, pressed && estilos.heroBotonPresionado]}>
            <Ionicons name="barcode-outline" size={iconos.medio} color={colores.blanco} />
            <Text style={estilos.heroBotonTexto}>Escanear libro</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Buscar por título o autor"
        onPress={() => router.push('/buscar')}
        style={({ pressed }) => [estilos.buscar, pressed && estilos.buscarPresionado]}>
        <Text style={estilos.buscarTexto}>Buscar título o autor…</Text>
        <Ionicons name="search" size={iconos.medio} color={colores.primario} />
      </Pressable>

      {recientes.length > 0 ? (
        <View style={estilos.seccion}>
          <Etiqueta texto="Vistos recientemente" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.filaRecientes}>
            {recientes.map((libro) => (
              <TarjetaReciente key={libro.isbn} libro={libro} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={estilos.seccion}>
        <Etiqueta texto="Todo el catálogo" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  hero: {
    height: medidas.hero,
    backgroundColor: colores.heroFondo,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  velo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colores.heroVelo,
  },
  heroContenido: {
    alignItems: 'center',
    paddingHorizontal: espacios.xl,
    gap: espacios.s,
  },
  heroTitulo: {
    fontFamily: fuentes.extra,
    fontSize: tamanios.grande,
    lineHeight: tamanios.grande * 1.2,
    color: colores.blanco,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  heroTexto: {
    fontFamily: fuentes.media,
    fontSize: tamanios.chico,
    color: colores.blanco,
    textAlign: 'center',
  },
  heroBoton: {
    marginTop: espacios.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.s,
    minHeight: medidas.areaTactil,
    paddingHorizontal: espacios.xl,
    borderRadius: radios.s,
    backgroundColor: colores.primario,
  },
  heroBotonPresionado: {
    backgroundColor: colores.primarioOscuro,
  },
  heroBotonTexto: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.chico,
    color: colores.blanco,
    textTransform: 'uppercase',
    letterSpacing: letras.ancho,
  },
  buscar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: espacios.l,
    marginTop: -espacios.xl,
    minHeight: medidas.areaTactil + espacios.s,
    paddingHorizontal: espacios.l,
    borderRadius: radios.pastilla,
    backgroundColor: colores.blanco,
    borderWidth: medidas.borde,
    borderColor: colores.borde,
  },
  buscarPresionado: {
    backgroundColor: colores.superficie,
  },
  buscarTexto: {
    fontFamily: fuentes.regular,
    fontSize: tamanios.chico,
    color: colores.textoTenue,
  },
  seccion: {
    marginTop: espacios.xl,
    paddingHorizontal: espacios.l,
  },
  filaRecientes: {
    gap: espacios.m,
    paddingBottom: espacios.s,
  },
});
