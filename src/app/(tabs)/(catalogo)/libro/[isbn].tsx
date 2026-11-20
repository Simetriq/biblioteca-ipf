import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Boton from '@/components/Boton';
import Disponibilidad from '@/components/Disponibilidad';
import EstadoMensaje from '@/components/EstadoMensaje';
import Etiqueta from '@/components/Etiqueta';
import Portada from '@/components/Portada';
import { YO } from '@/constants/biblioteca';
import { colores, espacios, fuentes, medidas, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { buscarLibroPorIsbn, ejemplaresDisponibles } from '@/lib/catalogo';
import { formatearFecha } from '@/lib/fechas';
import { esIsbnValido, primerValor } from '@/lib/isbn';

export default function DetalleLibro() {
  const params = useLocalSearchParams<{ isbn: string }>();
  const isbn = primerValor(params.isbn);
  const valido = esIsbnValido(isbn);
  const libro = valido ? buscarLibroPorIsbn(isbn) : undefined;
  const { registrarVisto, prestamos, esperas } = useBiblioteca();

  useEffect(() => {
    if (libro) {
      registrarVisto(libro);
    }
  }, [libro, registrarVisto]);

  if (!libro) {
    return (
      <View style={estilos.pantalla}>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <EstadoMensaje
          tono="error"
          titulo={valido ? 'Ese libro no está en el catálogo' : 'El código no es un ISBN válido'}
          detalle={
            valido
              ? `No encontramos ningún libro con ISBN ${isbn}.`
              : `«${isbn}» no tiene 13 dígitos. Revisá el enlace o buscá el libro por su título.`
          }
        />
        <View style={estilos.volver}>
          <Link href="/" style={estilos.enlace}>
            Ir al catálogo
          </Link>
        </View>
      </View>
    );
  }

  const disponibles = ejemplaresDisponibles(libro, prestamos);
  const cola = esperas[libro.isbn];
  const enEspera = cola?.tamanio ?? 0;
  const miPrestamo = prestamos.find((p) => p.isbn === libro.isbn);
  const miPosicion = (cola?.aArray().indexOf(YO) ?? -1) + 1;

  let estadoPropio: string | null = null;
  if (miPrestamo) {
    estadoPropio = `Lo tenés vos hasta el ${formatearFecha(miPrestamo.vence)}.`;
  } else if (miPosicion > 0) {
    estadoPropio = `Estás en la lista de espera, en el lugar ${miPosicion}.`;
  }

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: libro.titulo }} />

      <View style={estilos.portada}>
        <Portada libro={libro} tamanio="grande" />
      </View>

      <Text style={estilos.titulo}>{libro.titulo}</Text>
      <Text style={estilos.autor}>{libro.autor}</Text>

      <View style={estilos.ficha}>
        <View style={estilos.dato}>
          <Etiqueta texto="Año" />
          <Text style={estilos.valor}>{libro.anio}</Text>
        </View>
        <View style={estilos.dato}>
          <Etiqueta texto="En estante" />
          <Disponibilidad cantidad={disponibles} />
        </View>
        <View style={estilos.dato}>
          <Etiqueta texto="En espera" />
          <Text style={estilos.valor}>
            {enEspera === 0 ? 'Nadie' : `${enEspera} ${enEspera === 1 ? 'persona' : 'personas'}`}
          </Text>
        </View>
      </View>
      <Text style={estilos.isbn}>ISBN {libro.isbn}</Text>

      {estadoPropio ? (
        <Text style={estilos.propio}>{estadoPropio}</Text>
      ) : (
        <Boton
          titulo={disponibles > 0 ? 'Reservar' : 'Anotarme en la lista de espera'}
          onPress={() =>
            router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })
          }
        />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.papel,
  },
  contenido: {
    padding: espacios.xl,
    paddingBottom: espacios.xxl,
  },
  portada: {
    alignItems: 'center',
    marginBottom: espacios.xl,
  },
  titulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.titulo,
    lineHeight: tamanios.titulo * 1.15,
    color: colores.tinta,
    textAlign: 'center',
  },
  autor: {
    marginTop: espacios.xs,
    fontFamily: fuentes.serif,
    fontStyle: 'italic',
    fontSize: tamanios.medio,
    color: colores.tintaSuave,
    textAlign: 'center',
  },
  ficha: {
    flexDirection: 'row',
    marginTop: espacios.xl,
    paddingVertical: espacios.l,
    borderTopWidth: medidas.borde,
    borderBottomWidth: medidas.borde,
    borderColor: colores.tinta,
  },
  dato: {
    flex: 1,
    alignItems: 'center',
  },
  valor: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.medio,
    color: colores.tinta,
  },
  isbn: {
    marginTop: espacios.s,
    marginBottom: espacios.xl,
    fontFamily: fuentes.mono,
    fontSize: tamanios.mini,
    color: colores.tintaTenue,
    textAlign: 'center',
  },
  propio: {
    fontFamily: fuentes.serif,
    fontStyle: 'italic',
    fontSize: tamanios.base,
    color: colores.bosque,
    textAlign: 'center',
  },
  volver: {
    alignItems: 'center',
  },
  enlace: {
    minHeight: medidas.areaTactil,
    paddingVertical: espacios.m,
    fontFamily: fuentes.serif,
    fontSize: tamanios.medio,
    color: colores.bosque,
    textDecorationLine: 'underline',
  },
});
