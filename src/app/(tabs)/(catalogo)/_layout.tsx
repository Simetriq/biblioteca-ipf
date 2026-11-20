import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import EnlacePersonal from '@/components/EnlacePersonal';
import { colores, fuentes } from '@/constants/tema';

export const unstable_settings = {
  anchor: 'index',
};

export default function CatalogoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: estilos.cabecera,
        headerTintColor: colores.tinta,
        headerTitleStyle: estilos.titulo,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: estilos.contenido,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Biblioteca IPF',
          headerRight: () => <EnlacePersonal />,
        }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
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
