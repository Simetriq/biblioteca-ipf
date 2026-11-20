import * as SplashScreen from 'expo-splash-screen';

import NavegacionRaiz from '@/components/NavegacionRaiz';
import { BibliotecaProvider } from '@/context/BibliotecaContext';

SplashScreen.preventAutoHideAsync();

// Un deep link a /buscar (o cualquier pantalla del Stack raíz)
// deja las pestañas debajo, para que "atrás" tenga a dónde volver.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <NavegacionRaiz />
    </BibliotecaProvider>
  );
}
