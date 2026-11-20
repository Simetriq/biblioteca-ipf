import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import Boton from '@/components/Boton';
import { colores, espacios, fuentes, medidas, radios, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

export default function Login() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  function ingresar() {
    // Si es correcto, Stack.Protected quita esta pantalla: se cierra sola.
    if (!iniciarSesion(usuario, clave)) {
      setError('Usuario o clave incorrectos. Revisalos e intentá de nuevo.');
      setClave('');
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={estilos.titulo}>Ingreso del personal</Text>
      <Text style={estilos.texto}>Solo para quienes atienden el mostrador de la biblioteca.</Text>

      <View style={estilos.formulario}>
        <Text style={estilos.rotulo}>Usuario</Text>
        <TextInput
          accessibilityLabel="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoCorrect={false}
          style={estilos.campo}
        />
        <Text style={estilos.rotulo}>Clave</Text>
        <TextInput
          accessibilityLabel="Clave"
          value={clave}
          onChangeText={setClave}
          secureTextEntry
          onSubmitEditing={ingresar}
          style={estilos.campo}
        />
        {error ? (
          <Text style={estilos.error} accessibilityLiveRegion="assertive">
            {error}
          </Text>
        ) : null}
        <View style={estilos.boton}>
          <Boton
            titulo="Ingresar"
            onPress={ingresar}
            deshabilitado={usuario.trim() === '' || clave === ''}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: espacios.xl,
    backgroundColor: colores.papel,
  },
  titulo: {
    fontFamily: fuentes.serif,
    fontSize: tamanios.titulo,
    color: colores.tinta,
  },
  texto: {
    marginTop: espacios.s,
    fontSize: tamanios.base,
    color: colores.tintaSuave,
  },
  formulario: {
    marginTop: espacios.xl,
  },
  rotulo: {
    marginTop: espacios.m,
    marginBottom: espacios.xs,
    fontSize: tamanios.mini,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colores.tintaSuave,
  },
  campo: {
    minHeight: medidas.areaTactil,
    paddingHorizontal: espacios.m,
    borderRadius: radios.m,
    borderWidth: medidas.borde,
    borderColor: colores.linea,
    backgroundColor: colores.hoja,
    fontSize: tamanios.base,
    color: colores.tinta,
  },
  error: {
    marginTop: espacios.m,
    fontSize: tamanios.chico,
    fontWeight: '600',
    color: colores.terracota,
  },
  boton: {
    marginTop: espacios.xl,
  },
});
