import { describe, expect, it } from '@jest/globals';

import { Cola } from '../Cola';
import { Pila } from '../Pila';

describe('Pila', () => {
  it('empieza vacía', () => {
    const pila = new Pila<number>();
    expect(pila.tamanio).toBe(0);
    expect(pila.estaVacia()).toBe(true);
    expect(pila.tope()).toBeUndefined();
  });

  it('devuelve el último apilado (LIFO)', () => {
    const pila = new Pila<string>(['a', 'b']);
    pila.apilar('c');
    expect(pila.desapilar()).toBe('c');
    expect(pila.tope()).toBe('b');
    expect(pila.tamanio).toBe(2);
  });

  it('aArray devuelve una copia que no modifica la pila', () => {
    const pila = new Pila<number>([1, 2]);
    const copia = pila.aArray();
    copia.push(99);
    expect(pila.aArray()).toEqual([1, 2]);
  });
});

describe('Cola', () => {
  it('respeta el orden de llegada (FIFO)', () => {
    const cola = new Cola<string>(['Ana', 'Beto']);
    cola.encolar('Caro');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Beto');
    expect(cola.verFrente()).toBe('Caro');
  });

  it('desencolar una cola vacía devuelve undefined y no rompe el tamaño', () => {
    const cola = new Cola<number>();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
    cola.encolar(7);
    expect(cola.tamanio).toBe(1);
  });

  it('tamanio y aArray siguen bien después de mezclar operaciones', () => {
    const cola = new Cola<number>([1, 2, 3]);
    cola.desencolar();
    cola.encolar(4);
    expect(cola.tamanio).toBe(3);
    expect(cola.aArray()).toEqual([2, 3, 4]);
  });

  it('aArray devuelve una copia', () => {
    const cola = new Cola<number>([1]);
    cola.aArray().push(2);
    expect(cola.tamanio).toBe(1);
  });
});
