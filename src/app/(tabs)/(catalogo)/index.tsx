import { FlatList, StyleSheet } from 'react-native';

import EncabezadoCatalogo from '@/components/EncabezadoCatalogo';
import EstadoCarga from '@/components/EstadoCarga';
import EstadoMensaje from '@/components/EstadoMensaje';
import FilaLibro from '@/components/FilaLibro';
import { espacios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { ejemplaresDisponibles } from '@/lib/catalogo';

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes, prestamos } = useBiblioteca();

  function renderVacio() {
    if (cargando) {
      return <EstadoCarga mensaje="Buscando en los estantes…" />;
    }
    if (error) {
      return (
        <EstadoMensaje
          tono="error"
          titulo="No pudimos cargar el catálogo"
          detalle={error}
          accion={{ titulo: 'Reintentar', onPress: reintentar }}
        />
      );
    }
    return (
      <EstadoMensaje
        titulo="El catálogo está vacío"
        detalle="Todavía no hay libros cargados. Volvé a intentarlo más tarde."
        accion={{ titulo: 'Actualizar', onPress: reintentar }}
      />
    );
  }

  return (
    <FlatList
      data={cargando || error ? [] : libros}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => (
        <FilaLibro libro={item} disponibles={ejemplaresDisponibles(item, prestamos)} />
      )}
      ListHeaderComponent={<EncabezadoCatalogo recientes={recientes} />}
      ListEmptyComponent={renderVacio()}
      contentContainerStyle={estilos.lista}
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    paddingBottom: espacios.xxl,
  },
});
