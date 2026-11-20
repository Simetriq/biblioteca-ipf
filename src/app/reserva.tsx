import { Redirect } from 'expo-router';

// URL vieja de la versión anterior: se conserva para no romper enlaces.
export default function ReservaVieja() {
  return <Redirect href="/reservas" />;
}
