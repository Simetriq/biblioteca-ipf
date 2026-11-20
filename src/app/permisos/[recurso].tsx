import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import EstadoMensaje from '@/components/EstadoMensaje';
import ExplicacionPermiso from '@/components/ExplicacionPermiso';
import { esRecurso } from '@/constants/permisos';
import { colores, espacios } from '@/constants/tema';
import { primerValor } from '@/lib/isbn';

export default function PantallaPermiso() {
  const params = useLocalSearchParams<{ recurso: string; isbn?: string }>();
  const recurso = primerValor(params.recurso);

  return (
    <View style={estilos.pantalla}>
      {esRecurso(recurso) ? (
        <ExplicacionPermiso recurso={recurso} isbn={primerValor(params.isbn)} />
      ) : (
        <EstadoMensaje
          tono="error"
          titulo="Permiso desconocido"
          detalle="Esta app solo usa la cámara y las notificaciones."
          accion={{ titulo: 'Cerrar', onPress: () => router.back() }}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: espacios.xl,
    justifyContent: 'center',
    backgroundColor: colores.papel,
  },
});
