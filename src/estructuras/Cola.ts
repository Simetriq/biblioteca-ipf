// Cola FIFO sin shift(): dos índices marcan el frente y el final,
// así desencolar es O(1) y no reacomoda el resto de los elementos.
export class Cola<T> {
  #items: Record<number, T> = {};
  #frente = 0;
  #final = 0;

  constructor(iniciales: readonly T[] = []) {
    iniciales.forEach((elemento) => this.encolar(elemento));
  }

  encolar(elemento: T): void {
    this.#items[this.#final] = elemento;
    this.#final += 1;
  }

  desencolar(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    const elemento = this.#items[this.#frente];
    delete this.#items[this.#frente];
    this.#frente += 1;
    return elemento;
  }

  verFrente(): T | undefined {
    return this.estaVacia() ? undefined : this.#items[this.#frente];
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  get tamanio(): number {
    return this.#final - this.#frente;
  }

  // Copia del frente al final.
  aArray(): T[] {
    const copia: T[] = [];
    for (let i = this.#frente; i < this.#final; i += 1) {
      copia.push(this.#items[i]);
    }
    return copia;
  }
}
