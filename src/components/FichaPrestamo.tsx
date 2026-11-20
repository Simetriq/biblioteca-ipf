import { StyleSheet, Switch, Text, View } from 'react-native';

import { colores, espacios, fuentes, medidas, radios, tamanios } from '../constants/tema';
import { diasRestantes, formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';
import Boton from './Boton';

type Props = {
  prestamo: Prestamo;
  onCambiarRecordatorio: (prestamo: Prestamo, activar: boolean) => void;
  onDevolver: (prestamo: Prestamo) => void;
};

// Imita la ficha de préstamo de cartón: datos a la izquierda,
// fecha de devolución "sellada" a la derecha.
export default function FichaPrestamo({ prestamo, onCambiarRecordatorio, onDevolver }: Props) {
  const dias = diasRestantes(prestamo.vence);
  return (
    <View style={estilos.ficha}>
      <View style={estilos.cabecera}>
        <View style={estilos.datos}>
          <Text style={estilos.titulo} numberOfLines={2}>
            {prestamo.titulo}
          </Text>
          <Text style={estilos.isbn}>ISBN {prestamo.isbn}</Text>
        </View>
        <View style={estilos.sello}>
          <Text style={estilos.selloRotulo}>Devolver</Text>
          <Text style={estilos.selloFecha}>{formatearFecha(prestamo.vence)}</Text>
          <Text style={estilos.selloDias}>{dias <= 0 ? 'hoy' : `en ${dias} días`}</Text>
        </View>
      </View>

      <View style={estilos.pie}>
        <View style={estilos.recordar}>
          <Switch
            accessibilityLabel={`Recordarme la devolución de ${prestamo.titulo}`}
            value={prestamo.recordar}
            onValueChange={(valor) => onCambiarRecordatorio(prestamo, valor)}
            trackColor={{ false: colores.borde, true: colores.primario }}
            thumbColor={colores.blanco}
          />
          <Text style={estilos.recordarTexto}>Recordarme</Text>
        </View>
        <Boton titulo="Devolver" variante="secundario" onPress={() => onDevolver(prestamo)} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  ficha: {
    marginHorizontal: espacios.l,
    marginBottom: espacios.m,
    backgroundColor: colores.blanco,
    borderRadius: radios.m,
    borderWidth: medidas.borde,
    borderColor: colores.borde,
  },
  cabecera: {
    flexDirection: 'row',
    padding: espacios.l,
    gap: espacios.m,
  },
  datos: {
    flex: 1,
    gap: espacios.xs,
  },
  titulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.medio,
    color: colores.texto,
  },
  isbn: {
    fontFamily: fuentes.mono,
    fontSize: tamanios.mini,
    color: colores.textoTenue,
  },
  sello: {
    alignItems: 'center',
    paddingHorizontal: espacios.s,
    paddingVertical: espacios.xs,
    borderWidth: medidas.borde * 2,
    borderColor: colores.alerta,
    borderRadius: radios.s,
    transform: [{ rotate: '-4deg' }],
  },
  selloRotulo: {
    fontSize: tamanios.mini,
    fontFamily: fuentes.negrita,
    color: colores.alerta,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selloFecha: {
    fontFamily: fuentes.mono,
    fontSize: tamanios.chico,
    color: colores.alerta,
  },
  selloDias: {
    fontSize: tamanios.mini,
    color: colores.alerta,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacios.l,
    paddingVertical: espacios.s,
    borderTopWidth: medidas.borde,
    borderTopColor: colores.borde,
    borderStyle: 'dashed',
  },
  recordar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacios.s,
    minHeight: medidas.areaTactil,
  },
  recordarTexto: {
    fontSize: tamanios.base,
    color: colores.texto,
  },
});
