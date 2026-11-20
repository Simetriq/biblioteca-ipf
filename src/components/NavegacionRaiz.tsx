import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat/800ExtraBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { colores, fuentes } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { configurarPresentacion } from '../lib/notificaciones';

// El splash queda visible hasta que se leen los datos guardados y se
// cargan las fuentes: así la app nunca se muestra "vacía" un instante.
// Si la fuente falla, se sigue con la del sistema.
export default function NavegacionRaiz() {
  const { listo, sesionIniciada } = useBiblioteca();
  const [fuentesListas, errorFuentes] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });
  const preparado = listo && (fuentesListas || errorFuentes !== null);

  useEffect(() => {
    configurarPresentacion();
  }, []);

  useEffect(() => {
    if (preparado) {
      SplashScreen.hideAsync();
    }
  }, [preparado]);

  if (!preparado) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: estilos.cabecera,
          headerTintColor: colores.blanco,
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
    backgroundColor: colores.primario,
  },
  titulo: {
    fontFamily: fuentes.extra,
    color: colores.blanco,
  },
  contenido: {
    backgroundColor: colores.fondo,
  },
});
