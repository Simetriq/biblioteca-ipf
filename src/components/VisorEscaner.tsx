import { CameraView, type BarcodeScanningResult, type BarcodeSettings } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacios, medidas, radios, tamanios } from '../constants/tema';

// Solo EAN-13: el código de la contratapa de los libros.
const AJUSTES_ESCANER: BarcodeSettings = { barcodeTypes: ['ean13'] };

type Props = {
  onCodigo: (resultado: BarcodeScanningResult) => void;
  aviso: string | null;
};

export default function VisorEscaner({ onCodigo, aviso }: Props) {
  return (
    <View style={estilos.visor}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={AJUSTES_ESCANER}
        onBarcodeScanned={onCodigo}
      />
      <View style={estilos.marco} pointerEvents="none" />
      <Text style={estilos.ayuda}>Encuadrá el código de la contratapa</Text>
      {aviso ? (
        <View style={estilos.aviso} accessibilityLiveRegion="assertive">
          <Text style={estilos.avisoTexto}>{aviso}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  visor: {
    height: medidas.visor,
    borderRadius: radios.l,
    overflow: 'hidden',
    backgroundColor: colores.camaraFondo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marco: {
    width: '78%',
    height: '42%',
    borderWidth: medidas.borde * 2,
    borderColor: colores.primario,
    borderRadius: radios.m,
  },
  ayuda: {
    position: 'absolute',
    bottom: espacios.m,
    fontSize: tamanios.chico,
    color: colores.blanco,
  },
  aviso: {
    position: 'absolute',
    top: espacios.m,
    left: espacios.m,
    right: espacios.m,
    padding: espacios.s,
    borderRadius: radios.m,
    backgroundColor: colores.alerta,
  },
  avisoTexto: {
    fontSize: tamanios.chico,
    color: colores.blanco,
    textAlign: 'center',
  },
});
