/**
 * É usado em casos bem especificos
 * Pode ser coletado após perder as referencias
 * tem a maioria dos beneficios do Map
 * NÃO É ITERAVEL
 * Mais leve e preve leak de memória
 */

const myWeakMap = new WeakMap();
const hero = { name: "assssasdfasdf" };
myWeakMap.set(hero);
myWeakMap.get(hero);
myWeakMap.has(hero);
myWeakMap.delete(hero);
