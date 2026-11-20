import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet } from 'react-native';

import { colores, fuentes, tamanios } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

function colorIcono(activo: boolean): string {
  return activo ? colores.bosque : colores.tintaTenue;
}

export const unstable_settings = {
  anchor: '(catalogo)',
};

export default function TabsLayout() {
  const { avisos } = useBiblioteca();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.bosque,
        tabBarInactiveTintColor: colores.tintaTenue,
        tabBarStyle: estilos.barra,
        tabBarLabelStyle: estilos.etiqueta,
        headerStyle: estilos.cabecera,
        headerTitleStyle: estilos.tituloCabecera,
        headerShadowVisible: false,
        sceneStyle: estilos.escena,
      }}>
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="library-outline" color={colorIcono(focused)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarBadge: avisos.length > 0 ? avisos.length : undefined,
          tabBarBadgeStyle: estilos.insignia,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="bookmark-outline" color={colorIcono(focused)} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  barra: {
    backgroundColor: colores.papel,
    borderTopColor: colores.linea,
  },
  etiqueta: {
    fontSize: tamanios.mini,
    fontWeight: '600',
  },
  cabecera: {
    backgroundColor: colores.papel,
  },
  tituloCabecera: {
    fontFamily: fuentes.serif,
    color: colores.tinta,
  },
  escena: {
    backgroundColor: colores.papel,
  },
  insignia: {
    backgroundColor: colores.terracota,
    color: colores.hoja,
  },
});
