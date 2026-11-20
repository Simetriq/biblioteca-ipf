import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Boton from '@/components/Boton';
import EstadoMensaje from '@/components/EstadoMensaje';
import Etiqueta from '@/components/Etiqueta';
import Portada from '@/components/Portada';
import { DIAS_PRESTAMO } from '@/constants/biblioteca';
import { colores, espacios, fuentes, medidas, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { buscarLibroPorIsbn, ejemplaresDisponibles } from '@/lib/catalogo';
import { formatearFecha, sumarDias } from '@/lib/fechas';
import { esIsbnValido, primerValor } from '@/lib/isbn';

export default function ConfirmarReserva() {
  const params = useLocalSearchParams<{ isbn: string }>();
  const isbn = primerValor(params.isbn);
  const libro = esIsbnValido(isbn) ? buscarLibroPorIsbn(isbn) : undefined;
  const { reservar, prestamos, esperas } = useBiblioteca();
  const [rechazo, setRechazo] = useState<string | null>(null);

  if (!libro) {
    return (
      <View style={estilos.pantalla}>
        <EstadoMensaje
          tono="error"
          titulo="No podemos reservar este libro"
          detalle="El ISBN no corresponde a ningún libro del catálogo."
          accion={{ titulo: 'Cerrar', onPress: () => router.back() }}
        />
      </View>
    );
  }

  const hayEjemplares = ejemplaresDisponibles(libro, prestamos) > 0;
  const posicionFutura = (esperas[libro.isbn]?.tamanio ?? 0) + 1;

  function confirmar() {
    if (!libro) {
      return;
    }
    const resultado = reservar(libro);
    if (resultado.tipo === 'rechazada') {
      setRechazo(resultado.motivo);
      return;
    }
    // Cierra el modal y va a la pestaña: "atrás" ya no vuelve a esta confirmación.
    router.dismiss();
    router.navigate('/reservas');
  }

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.cabecera}>
        <Portada libro={libro} tamanio="media" />
        <View style={estilos.datos}>
          <Text style={estilos.titulo}>{libro.titulo}</Text>
          <Text style={estilos.autor}>{libro.autor}</Text>
        </View>
      </View>

      <View style={estilos.condicion}>
        <Etiqueta texto={hayEjemplares ? 'Préstamo' : 'Lista de espera'} />
        <Text style={estilos.explicacion}>
          {hayEjemplares
            ? `Hay ejemplares en el estante. Te lo llevás por ${DIAS_PRESTAMO} días: devolvelo antes del ${formatearFecha(sumarDias(new Date(), DIAS_PRESTAMO).toISOString())}.`
            : `No quedan ejemplares. Te anotamos en la lista de espera en el lugar ${posicionFutura} y te avisamos cuando sea tu turno.`}
        </Text>
      </View>

      {rechazo ? <Text style={estilos.rechazo}>{rechazo}</Text> : null}

      <View style={estilos.botones}>
        <Boton
          titulo={hayEjemplares ? 'Confirmar préstamo' : 'Anotarme'}
          onPress={confirmar}
          deshabilitado={rechazo !== null}
        />
        <Boton titulo="Cancelar" variante="enlace" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: espacios.xl,
    backgroundColor: colores.fondo,
  },
  cabecera: {
    flexDirection: 'row',
    gap: espacios.l,
    alignItems: 'flex-end',
  },
  datos: {
    flex: 1,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.grande,
    color: colores.texto,
  },
  autor: {
    marginTop: espacios.xs,
    fontFamily: fuentes.negrita,
    fontSize: tamanios.base,
    color: colores.textoSuave,
  },
  condicion: {
    marginTop: espacios.xl,
    paddingTop: espacios.l,
    borderTopWidth: medidas.borde,
    borderTopColor: colores.texto,
  },
  explicacion: {
    fontSize: tamanios.medio,
    lineHeight: tamanios.medio * 1.45,
    color: colores.texto,
  },
  rechazo: {
    marginTop: espacios.l,
    fontSize: tamanios.base,
    fontFamily: fuentes.negrita,
    color: colores.alerta,
  },
  botones: {
    marginTop: espacios.xl,
    gap: espacios.s,
  },
});
