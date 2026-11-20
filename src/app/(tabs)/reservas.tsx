import { router } from 'expo-router';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import AvisoEnApp from '@/components/AvisoEnApp';
import EstadoMensaje from '@/components/EstadoMensaje';
import EstadoNotificaciones from '@/components/EstadoNotificaciones';
import Etiqueta from '@/components/Etiqueta';
import FichaPrestamo from '@/components/FichaPrestamo';
import FilaEspera from '@/components/FilaEspera';
import { YO } from '@/constants/biblioteca';
import { colores, espacios, fuentes, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { usePermiso } from '@/hooks/usePermiso';
import { buscarLibroPorIsbn } from '@/lib/catalogo';
import type { Prestamo } from '@/types';

type Fila =
  | { tipo: 'prestamo'; isbn: string; prestamo: Prestamo }
  | { tipo: 'espera'; isbn: string; titulo: string; posicion: number };

type Seccion = { titulo: string; vacia: string; data: Fila[] };

export default function MisReservas() {
  const {
    prestamos,
    esperas,
    avisos,
    descartarAviso,
    devolver,
    activarRecordatorio,
    desactivarRecordatorio,
  } = useBiblioteca();
  const { estado: permisoNotificaciones } = usePermiso('notificaciones');

  const filasPrestamo: Fila[] = prestamos.map((prestamo) => ({
    tipo: 'prestamo',
    isbn: prestamo.isbn,
    prestamo,
  }));

  const filasEspera: Fila[] = Object.entries(esperas).flatMap(([isbn, cola]) => {
    const posicion = cola.aArray().indexOf(YO) + 1;
    const libro = buscarLibroPorIsbn(isbn);
    return posicion > 0 && libro
      ? [{ tipo: 'espera' as const, isbn, titulo: libro.titulo, posicion }]
      : [];
  });

  const secciones: Seccion[] = [
    { titulo: 'Préstamos', vacia: 'No tenés libros prestados.', data: filasPrestamo },
    { titulo: 'En lista de espera', vacia: 'No estás esperando ningún libro.', data: filasEspera },
  ];

  function cambiarRecordatorio(prestamo: Prestamo, activar: boolean) {
    if (!activar) {
      desactivarRecordatorio(prestamo.isbn);
      return;
    }
    if (permisoNotificaciones === 'concedido') {
      activarRecordatorio(prestamo.isbn);
      return;
    }
    // El permiso se pide recién acá, con la pantalla previa delante.
    router.push({
      pathname: '/permisos/[recurso]',
      params: { recurso: 'notificaciones', isbn: prestamo.isbn },
    });
  }

  const sinNada = filasPrestamo.length === 0 && filasEspera.length === 0;

  return (
    <SectionList
      sections={sinNada ? [] : secciones}
      keyExtractor={(fila) => `${fila.tipo}-${fila.isbn}`}
      renderItem={({ item }) =>
        item.tipo === 'prestamo' ? (
          <FichaPrestamo
            prestamo={item.prestamo}
            onCambiarRecordatorio={cambiarRecordatorio}
            onDevolver={(prestamo) => devolver(prestamo.isbn)}
          />
        ) : (
          <FilaEspera isbn={item.isbn} titulo={item.titulo} posicion={item.posicion} />
        )
      }
      renderSectionHeader={({ section }) => (
        <View style={estilos.encabezadoSeccion}>
          <Etiqueta texto={section.titulo} />
        </View>
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? <Text style={estilos.seccionVacia}>{section.vacia}</Text> : null
      }
      ListHeaderComponent={
        <View style={estilos.cabecera}>
          <Text style={estilos.titulo}>Tus libros</Text>
          <EstadoNotificaciones estado={permisoNotificaciones} />
          {avisos.map((aviso) => (
            <AvisoEnApp key={aviso.id} aviso={aviso} onDescartar={descartarAviso} />
          ))}
        </View>
      }
      ListEmptyComponent={
        <EstadoMensaje
          titulo="Todavía no reservaste nada"
          detalle="Elegí un libro del catálogo y tocá «Reservar»."
          accion={{ titulo: 'Ver el catálogo', onPress: () => router.navigate('/') }}
        />
      }
      stickySectionHeadersEnabled={false}
      contentContainerStyle={estilos.lista}
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    paddingBottom: espacios.xxl,
  },
  cabecera: {
    paddingTop: espacios.l,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.titulo,
    color: colores.texto,
    paddingHorizontal: espacios.l,
    marginBottom: espacios.s,
  },
  encabezadoSeccion: {
    paddingHorizontal: espacios.l,
    paddingTop: espacios.xl,
  },
  seccionVacia: {
    paddingHorizontal: espacios.l,
    fontFamily: fuentes.negrita,
    fontSize: tamanios.base,
    color: colores.textoTenue,
  },
});
