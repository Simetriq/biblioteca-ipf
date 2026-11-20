const TRECE_DIGITOS = /^\d{13}$/;

export function esIsbnValido(valor: string): boolean {
  return TRECE_DIGITOS.test(valor);
}

// Deja solo los dígitos: permite pegar "978-950-731-001-0".
export function limpiarIsbn(valor: string): string {
  return valor.replace(/\D/g, '');
}

// useLocalSearchParams puede devolver string o string[].
export function primerValor(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) {
    return valor[0] ?? '';
  }
  return valor ?? '';
}
