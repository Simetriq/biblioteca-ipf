import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colores, espacios, fuentes, medidas, radios, tamanios } from '../constants/tema';
import { esIsbnValido, limpiarIsbn } from '../lib/isbn';
import Boton from './Boton';

type Props = {
  onIsbn: (isbn: string) => void;
  error?: string | null;
};

// Alternativa que siempre está: funciona sin cámara.
export default function IngresoIsbn({ onIsbn, error }: Props) {
  const [texto, setTexto] = useState('');
  const isbn = limpiarIsbn(texto);
  const valido = esIsbnValido(isbn);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.rotulo}>¿Sin cámara? Escribí el ISBN</Text>
      <View style={estilos.fila}>
        <TextInput
          accessibilityLabel="ISBN de 13 dígitos"
          value={texto}
          onChangeText={setTexto}
          placeholder="978…"
          placeholderTextColor={colores.textoTenue}
          keyboardType="number-pad"
          maxLength={17}
          returnKeyType="go"
          onSubmitEditing={() => valido && onIsbn(isbn)}
          style={estilos.campo}
        />
        <Boton titulo="Abrir" onPress={() => onIsbn(isbn)} deshabilitado={!valido} />
      </View>
      <Text style={[estilos.ayuda, error ? estilos.error : null]}>
        {error ?? `${isbn.length}/13 dígitos`}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacios.s,
  },
  rotulo: {
    fontFamily: fuentes.negrita,
    fontSize: tamanios.medio,
    color: colores.texto,
  },
  fila: {
    flexDirection: 'row',
    gap: espacios.s,
  },
  campo: {
    flex: 1,
    minHeight: medidas.areaTactil,
    paddingHorizontal: espacios.m,
    borderRadius: radios.m,
    borderWidth: medidas.borde,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    fontFamily: fuentes.mono,
    fontSize: tamanios.base,
    color: colores.texto,
  },
  ayuda: {
    fontSize: tamanios.mini,
    color: colores.textoSuave,
  },
  error: {
    color: colores.alerta,
    fontFamily: fuentes.negrita,
  },
});
