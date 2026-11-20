import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { EXPLICACIONES_PERMISO } from '../constants/permisos';
import { colores, espacios, fuentes, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePermiso } from '../hooks/usePermiso';
import type { Recurso } from '../types';
import Boton from './Boton';
import EstadoCarga from './EstadoCarga';

type Props = {
  recurso: Recurso;
  // Si llega, al conceder notificaciones se activa el recordatorio de ese préstamo.
  isbn: string;
};

export default function ExplicacionPermiso({ recurso, isbn }: Props) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const { activarRecordatorio, agregarAviso } = useBiblioteca();
  const explicacion = EXPLICACIONES_PERMISO[recurso];

  async function continuar() {
    const concedido = await pedir();
    if (recurso === 'notificaciones' && isbn !== '') {
      if (concedido) {
        await activarRecordatorio(isbn);
      } else {
        agregarAviso('Sin notificaciones no podemos recordarte la devolución. Revisá la fecha en esta pantalla.');
      }
    }
    router.back();
  }

  if (estado === 'cargando') {
    return <EstadoCarga mensaje="Un momento…" />;
  }

  const bloqueado = estado === 'bloqueado';

  return (
    <View>
      <View style={estilos.icono}>
        <Ionicons name={explicacion.icono} size={tamanios.portada} color={colores.primario} />
      </View>
      <Text style={estilos.titulo}>{explicacion.titulo}</Text>
      <Text style={estilos.texto}>{bloqueado ? explicacion.bloqueado : explicacion.beneficio}</Text>
      <View style={estilos.boton}>
        {estado === 'concedido' ? (
          <Boton titulo="Listo" onPress={() => router.back()} />
        ) : (
          <Boton
            titulo={bloqueado ? 'Abrir Ajustes' : 'Continuar'}
            onPress={bloqueado ? abrirAjustes : continuar}
          />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  icono: {
    alignSelf: 'flex-start',
    marginBottom: espacios.l,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.titulo,
    color: colores.texto,
  },
  texto: {
    marginTop: espacios.m,
    fontSize: tamanios.medio,
    lineHeight: tamanios.medio * 1.5,
    color: colores.textoSuave,
  },
  boton: {
    marginTop: espacios.xxl,
  },
});
