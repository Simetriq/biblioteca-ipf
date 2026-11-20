// Pila LIFO. El tope es el último elemento apilado.
export class Pila<T> {
  #items: T[] = [];

  constructor(iniciales: readonly T[] = []) {
    this.#items = [...iniciales];
  }

  apilar(elemento: T): void {
    this.#items.push(elemento);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  tope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  // Copia de base a tope: quien la recibe no puede modificar la pila.
  aArray(): T[] {
    return [...this.#items];
  }
}
