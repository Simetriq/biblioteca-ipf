import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { colores, fuentes } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { configurarPresentacion } from '../lib/notificaciones';

// El splash queda visible hasta que se leen los datos guardados:
// así la app nunca se muestra "vacía" un instante.
export default function NavegacionRaiz() {
  const { listo, sesionIniciada } = useBiblioteca();

  useEffect(() => {
    configurarPresentacion();
  }, []);

  useEffect(() => {
    if (listo) {
      SplashScreen.hideAsync();
    }
  }, [listo]);

  if (!listo) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: estilos.cabecera,
          headerTintColor: colores.tinta,
          headerTitleStyle: estilos.titulo,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: estilos.contenido,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
        <Stack.Screen name="escanear" options={{ title: 'Escanear' }} />
        <Stack.Screen
          name="reservar/[isbn]"
          options={{ title: 'Confirmar reserva', presentation: 'modal' }}
        />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{ title: 'Antes de seguir', presentation: 'modal' }}
        />
        <Stack.Screen name="reserva" options={{ headerShown: false }} />

        <Stack.Protected guard={!sesionIniciada}>
          <Stack.Screen name="login" options={{ title: 'Personal', presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={sesionIniciada}>
          <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" options={{ title: 'No encontrada' }} />
      </Stack>
    </>
  );
}

const estilos = StyleSheet.create({
  cabecera: {
    backgroundColor: colores.papel,
  },
  titulo: {
    fontFamily: fuentes.serif,
    color: colores.tinta,
  },
  contenido: {
    backgroundColor: colores.papel,
  },
});
