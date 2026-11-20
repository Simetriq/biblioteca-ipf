import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import EstadoCarga from '@/components/EstadoCarga';
import EstadoMensaje from '@/components/EstadoMensaje';
import FilaLibro from '@/components/FilaLibro';
import { DEMORA_BUSQUEDA_MS } from '@/constants/biblioteca';
import { colores, espacios, iconos, medidas, radios, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useBusqueda } from '@/hooks/useBusqueda';
import { ejemplaresDisponibles } from '@/lib/catalogo';
import { primerValor } from '@/lib/isbn';

export default function Buscar() {
  const params = useLocalSearchParams<{ q?: string }>();
  const q = primerValor(params.q);
  const [texto, setTexto] = useState(q);
  const { consulta, cargando, libros, error } = useBusqueda(q);
  const { prestamos } = useBiblioteca();

  // Debounce: la URL se actualiza 300 ms después de la última tecla.
  // setParams reemplaza el parámetro sin apilar pantallas nuevas.
  useEffect(() => {
    if (texto === q) {
      return;
    }
    const temporizador = setTimeout(() => {
      router.setParams({ q: texto });
    }, DEMORA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto, q]);

  function renderVacio() {
    if (consulta === '') {
      return (
        <EstadoMensaje
          titulo="Buscá por título o autor"
          detalle="Por ejemplo: «Borges», «Rayuela» o «Sabato»."
        />
      );
    }
    if (cargando) {
      return <EstadoCarga mensaje={`Buscando «${consulta}»…`} />;
    }
    if (error) {
      return (
        <EstadoMensaje
          tono="error"
          titulo="La búsqueda falló"
          detalle={error}
          accion={{ titulo: 'Borrar búsqueda', onPress: () => setTexto('') }}
        />
      );
    }
    return (
      <EstadoMensaje
        titulo="Sin resultados"
        detalle={`No hay libros que coincidan con «${consulta}». Probá con otra palabra.`}
      />
    );
  }

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.campoContenedor}>
        <Ionicons name="search" size={iconos.medio} color={colores.tintaSuave} />
        <TextInput
          accessibilityLabel="Buscar por título o autor"
          value={texto}
          onChangeText={setTexto}
          placeholder="Título o autor"
          placeholderTextColor={colores.tintaTenue}
          autoFocus={q === ''}
          autoCorrect={false}
          returnKeyType="search"
          style={estilos.campo}
        />
      </View>
      <FlatList
        data={cargando || error ? [] : libros}
        keyExtractor={(libro) => libro.isbn}
        renderItem={({ item }) => (
          <FilaLibro libro={item} disponibles={ejemplaresDisponibles(item, prestamos)} />
        )}
        ListEmptyComponent={renderVacio()}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.papel,
  },
  campoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.s,
    margin: espacios.l,
    paddingHorizontal: espacios.m,
    borderRadius: radios.m,
    borderWidth: medidas.borde,
    borderColor: colores.tinta,
    backgroundColor: colores.hoja,
  },
  campo: {
    flex: 1,
    minHeight: medidas.areaTactil,
    fontSize: tamanios.medio,
    color: colores.tinta,
  },
});
