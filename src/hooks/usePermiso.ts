import { useCameraPermissions, type PermissionResponse } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';

import { prepararCanal } from '../lib/notificaciones';
import type { EstadoPermiso, Recurso } from '../types';

function traducir(respuesta: PermissionResponse | null): EstadoPermiso {
  if (respuesta === null) {
    return 'cargando';
  }
  if (respuesta.granted) {
    return 'concedido';
  }
  // status solo dice "denied"; canAskAgain distingue si el sistema
  // todavía muestra el diálogo o hay que ir a Ajustes.
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}

export function usePermiso(recurso: Recurso) {
  const [camara, pedirCamara, obtenerCamara] = useCameraPermissions({ get: false });
  const [notificaciones, setNotificaciones] = useState<PermissionResponse | null>(null);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const refrescar = useCallback(async () => {
    if (recurso === 'camara') {
      await obtenerCamara();
      return;
    }
    const respuesta = await Notifications.getPermissionsAsync();
    if (montado.current) {
      setNotificaciones(respuesta);
    }
  }, [recurso, obtenerCamara]);

  // Al volver a la pantalla (por ejemplo, desde la pantalla previa).
  useFocusEffect(
    useCallback(() => {
      refrescar();
    }, [refrescar]),
  );

  // Al volver a la app (por ejemplo, desde Ajustes del sistema).
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') {
        refrescar();
      }
    });
    return () => suscripcion.remove();
  }, [refrescar]);

  const pedir = useCallback(async (): Promise<boolean> => {
    if (recurso === 'camara') {
      const respuesta = await pedirCamara();
      return respuesta.granted;
    }
    await prepararCanal();
    const respuesta = await Notifications.requestPermissionsAsync();
    if (montado.current) {
      setNotificaciones(respuesta);
    }
    return respuesta.granted;
  }, [recurso, pedirCamara]);

  const abrirAjustes = useCallback(() => {
    Linking.openSettings();
  }, []);

  const estado = traducir(recurso === 'camara' ? camara : notificaciones);

  return { estado, pedir, abrirAjustes, refrescar };
}
