import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import Boton from '@/components/Boton';
import EstadoMensaje from '@/components/EstadoMensaje';
import FilaMostrador from '@/components/FilaMostrador';
import { YO } from '@/constants/biblioteca';
import { colores, espacios, fuentes, medidas, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { librosConEspera } from '@/lib/catalogo';
import type { Libro } from '@/types';

export default function Mostrador() {
  const { esperas, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [ultimo, setUltimo] = useState<string | null>(null);

  const isbnsConEspera = Object.entries(esperas)
    .filter(([, cola]) => !cola.estaVacia())
    .map(([isbn]) => isbn);
  const libros = librosConEspera(isbnsConEspera);

  async function entregar(libro: Libro) {
    setOcupado(libro.isbn);
    const persona = await entregarAlSiguiente(libro.isbn);
    setOcupado(null);
    if (persona === null) {
      setUltimo(`La lista de «${libro.titulo}» ya estaba vacía.`);
    } else {
      setUltimo(
        `«${libro.titulo}» entregado a ${persona === YO ? 'la persona de este teléfono' : persona}.`,
      );
    }
  }

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={libros}
        keyExtractor={(libro) => libro.isbn}
        renderItem={({ item }) => {
          const cola = esperas[item.isbn];
          return (
            <FilaMostrador
              libro={item}
              alFrente={cola?.verFrente()}
              cantidad={cola?.tamanio ?? 0}
              ocupado={ocupado === item.isbn}
              onEntregar={entregar}
            />
          );
        }}
        ListHeaderComponent={
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Listas de espera</Text>
            <Text style={estilos.texto}>
              «Entregar al siguiente» simula que volvió un ejemplar y se lo da a quien está al frente.
            </Text>
            {ultimo ? <Text style={estilos.ultimo}>{ultimo}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          <EstadoMensaje
            titulo="No hay nadie esperando"
            detalle="Cuando alguien se anote en un libro sin ejemplares, va a aparecer acá."
          />
        }
        ListFooterComponent={
          <View style={estilos.pie}>
            <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
          </View>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.papel,
  },
  cabecera: {
    padding: espacios.l,
    borderBottomWidth: medidas.borde,
    borderBottomColor: colores.tinta,
  },
  titulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.titulo,
    color: colores.tinta,
  },
  texto: {
    marginTop: espacios.xs,
    fontSize: tamanios.chico,
    color: colores.tintaSuave,
  },
  ultimo: {
    marginTop: espacios.m,
    fontFamily: fuentes.serif,
    fontStyle: 'italic',
    fontSize: tamanios.base,
    color: colores.bosque,
  },
  pie: {
    padding: espacios.xl,
  },
});
