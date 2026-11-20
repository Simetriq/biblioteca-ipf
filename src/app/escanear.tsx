import type { BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import Boton from '@/components/Boton';
import EstadoCarga from '@/components/EstadoCarga';
import IngresoIsbn from '@/components/IngresoIsbn';
import VisorEscaner from '@/components/VisorEscaner';
import { PAUSA_TRAS_ISBN_DESCONOCIDO_MS } from '@/constants/biblioteca';
import { colores, espacios, fuentes, medidas, radios, tamanios } from '@/constants/tema';
import { usePermiso } from '@/hooks/usePermiso';
import { buscarLibroPorIsbn } from '@/lib/catalogo';
import { esIsbnValido, limpiarIsbn } from '@/lib/isbn';

export default function Escanear() {
  const { estado, abrirAjustes } = usePermiso('camara');
  // useRef y no useState: el cambio tiene que verse en la llamada
  // siguiente de onBarcodeScanned, sin esperar a un nuevo render.
  const yaNavego = useRef(false);
  const ultimoDesconocido = useRef<string | null>(null);
  const [avisoCamara, setAvisoCamara] = useState<string | null>(null);
  const [errorManual, setErrorManual] = useState<string | null>(null);

  useEffect(() => {
    if (avisoCamara === null) {
      return;
    }
    const temporizador = setTimeout(() => setAvisoCamara(null), PAUSA_TRAS_ISBN_DESCONOCIDO_MS);
    return () => clearTimeout(temporizador);
  }, [avisoCamara]);

  function abrirLibro(isbn: string) {
    yaNavego.current = true;
    // replace: el escáner sale de la pila; "atrás" desde el detalle no lo reabre.
    router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
  }

  function alEscanear({ data }: BarcodeScanningResult) {
    if (yaNavego.current) {
      return;
    }
    const isbn = limpiarIsbn(data);
    if (!esIsbnValido(isbn) || ultimoDesconocido.current === isbn) {
      return;
    }
    if (!buscarLibroPorIsbn(isbn)) {
      ultimoDesconocido.current = isbn;
      setAvisoCamara(`El ISBN ${isbn} no está en el catálogo. Probá con otro libro.`);
      return;
    }
    abrirLibro(isbn);
  }

  function alIngresar(isbn: string) {
    if (!buscarLibroPorIsbn(isbn)) {
      setErrorManual('Ese ISBN no está en el catálogo. Revisá los números.');
      return;
    }
    setErrorManual(null);
    abrirLibro(isbn);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        {estado === 'cargando' ? <EstadoCarga mensaje="Revisando la cámara…" /> : null}

        {estado === 'concedido' ? (
          <VisorEscaner onCodigo={alEscanear} aviso={avisoCamara} />
        ) : null}

        {estado === 'preguntable' ? (
          <View style={estilos.tarjeta}>
            <Text style={estilos.tarjetaTitulo}>Escaneá en vez de tipear</Text>
            <Text style={estilos.tarjetaTexto}>
              Con la cámara leés el código de la contratapa y el libro se abre solo.
            </Text>
            <Boton titulo="Usar la cámara" onPress={() => router.push('/permisos/camara')} />
          </View>
        ) : null}

        {estado === 'bloqueado' ? (
          <View style={estilos.tarjeta}>
            <Text style={estilos.tarjetaTitulo}>La cámara está desactivada</Text>
            <Text style={estilos.tarjetaTexto}>
              Podés activarla en Ajustes o seguir escribiendo el ISBN acá abajo.
            </Text>
            <Boton titulo="Abrir Ajustes" variante="secundario" onPress={abrirAjustes} />
          </View>
        ) : null}

        <View style={estilos.manual}>
          <IngresoIsbn onIsbn={alIngresar} error={errorManual} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.papel,
  },
  contenido: {
    padding: espacios.l,
  },
  tarjeta: {
    padding: espacios.xl,
    gap: espacios.m,
    borderRadius: radios.l,
    borderWidth: medidas.borde,
    borderColor: colores.linea,
    borderStyle: 'dashed',
    backgroundColor: colores.hoja,
  },
  tarjetaTitulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.grande,
    color: colores.tinta,
  },
  tarjetaTexto: {
    fontSize: tamanios.base,
    lineHeight: tamanios.base * 1.45,
    color: colores.tintaSuave,
  },
  manual: {
    marginTop: espacios.xl,
  },
});
